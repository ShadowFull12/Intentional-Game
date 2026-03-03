/**
 * Intentional - Game Room Model
 * Authoritative server-side game state management
 */

const { getRandomProduct } = require('../utils/productGenerator');
const { getRandomWord } = require('../utils/wordGenerator');

// Game phase constants
const PHASES = {
  WAITING: 'waiting',
  PRODUCT_REVEAL: 'productReveal',
  WRITING: 'writing',
  REVEAL: 'reveal',
  VOTING: 'voting',
  RESULTS: 'results',
  NEXT_ROUND: 'nextRound',
};

// Timing constants (milliseconds)
const TIMERS = {
  PRODUCT_REVEAL: 5000,
  WRITING: 60000,
  REVEAL: 8000,
  VOTING: 30000,
  RESULTS: 10000,
  NEXT_ROUND: 5000,
};

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 10;
const MAX_ROUNDS = 10;

/**
 * Create a new player object
 */
function createPlayer(id, name) {
  return {
    id,
    name,
    score: 0,
    isHidden: false,
    hasSubmittedReview: false,
    hasVoted: false,
    isConnected: true,
    votedFor: null,
  };
}

/**
 * Create a new game room
 */
function createRoom(roomId, hostId) {
  return {
    roomId,
    hostId,
    phase: PHASES.WAITING,
    round: 0,
    maxRounds: MAX_ROUNDS,
    players: [],
    product: null,
    hiddenWord: null,
    hiddenPlayerId: null,
    reviews: [],
    votes: [],
    usedProducts: [],
    usedWords: [],
    timerEnd: null,
    createdAt: Date.now(),
  };
}

/**
 * Add a player to a room
 */
function addPlayer(room, playerId, playerName) {
  if (room.players.length >= MAX_PLAYERS) {
    return { success: false, error: 'Room is full' };
  }
  if (room.phase !== PHASES.WAITING) {
    return { success: false, error: 'Game already in progress' };
  }
  if (room.players.some(p => p.id === playerId)) {
    return { success: false, error: 'Already in room' };
  }
  // Check for duplicate names
  if (room.players.some(p => p.name.toLowerCase() === playerName.toLowerCase())) {
    return { success: false, error: 'Name already taken in this room' };
  }

  const player = createPlayer(playerId, playerName);
  room.players.push(player);
  return { success: true, player };
}

/**
 * Remove a player from a room
 */
function removePlayer(room, playerId) {
  room.players = room.players.filter(p => p.id !== playerId);
  // Update host if host left
  if (room.hostId === playerId && room.players.length > 0) {
    room.hostId = room.players[0].id;
  }
  return room.players.length;
}

/**
 * Check if the game can start
 */
function canStartGame(room) {
  if (room.players.length < MIN_PLAYERS) {
    return { canStart: false, error: `Need at least ${MIN_PLAYERS} players` };
  }
  if (room.phase !== PHASES.WAITING) {
    return { canStart: false, error: 'Game already in progress' };
  }
  return { canStart: true };
}

/**
 * Start a new round — pick product, hidden word, and hidden player
 */
function startNewRound(room) {
  room.round++;
  room.reviews = [];
  room.votes = [];

  // Reset player round state
  room.players.forEach(p => {
    p.isHidden = false;
    p.hasSubmittedReview = false;
    p.hasVoted = false;
    p.votedFor = null;
  });

  // Pick a random product (avoid repeats)
  room.product = getRandomProduct(room.usedProducts);
  room.usedProducts.push(room.product);

  // Pick a random hidden word (avoid repeats)
  room.hiddenWord = getRandomWord(room.usedWords);
  room.usedWords.push(room.hiddenWord);

  // Pick a random hidden player
  const idx = Math.floor(Math.random() * room.players.length);
  room.hiddenPlayerId = room.players[idx].id;
  room.players[idx].isHidden = true;

  return room;
}

/**
 * Submit a review for a player
 */
function submitReview(room, playerId, text) {
  const player = room.players.find(p => p.id === playerId);
  if (!player) return { success: false, error: 'Player not found' };
  if (player.hasSubmittedReview) return { success: false, error: 'Already submitted' };
  if (room.phase !== PHASES.WRITING) return { success: false, error: 'Not in writing phase' };

  player.hasSubmittedReview = true;
  room.reviews.push({ playerId, text });
  return { success: true, allSubmitted: room.players.every(p => p.hasSubmittedReview) };
}

/**
 * Submit a vote
 */
function submitVote(room, voterId, targetId) {
  const voter = room.players.find(p => p.id === voterId);
  if (!voter) return { success: false, error: 'Player not found' };
  if (voter.hasVoted) return { success: false, error: 'Already voted' };
  if (room.phase !== PHASES.VOTING) return { success: false, error: 'Not in voting phase' };
  if (voterId === targetId) return { success: false, error: 'Cannot vote for yourself' };

  voter.hasVoted = true;
  voter.votedFor = targetId;
  room.votes.push({ voterId, votedFor: targetId });
  return { success: true, allVoted: room.players.every(p => p.hasVoted) };
}

/**
 * Calculate round results and update scores
 */
function calculateResults(room) {
  // Count votes per player
  const voteCounts = {};
  room.players.forEach(p => { voteCounts[p.id] = 0; });
  room.votes.forEach(v => {
    if (voteCounts[v.votedFor] !== undefined) {
      voteCounts[v.votedFor]++;
    }
  });

  // Find who got the most votes
  let maxVotes = 0;
  let mostVoted = [];
  for (const [playerId, count] of Object.entries(voteCounts)) {
    if (count > maxVotes) {
      maxVotes = count;
      mostVoted = [playerId];
    } else if (count === maxVotes && count > 0) {
      mostVoted.push(playerId);
    }
  }

  const hiddenId = room.hiddenPlayerId;
  const isTie = mostVoted.length > 1;
  const hiddenCaught = !isTie && mostVoted.includes(hiddenId);
  const hiddenSurvived = !hiddenCaught;

  // Score calculation
  if (hiddenSurvived) {
    // Hidden player survives: +3 points
    const hiddenPlayer = room.players.find(p => p.id === hiddenId);
    if (hiddenPlayer) hiddenPlayer.score += 3;
  }

  // Players who correctly guessed: +2 points
  room.votes.forEach(v => {
    if (v.votedFor === hiddenId) {
      const voter = room.players.find(p => p.id === v.voterId);
      if (voter) voter.score += 2;
    }
  });

  return {
    voteCounts,
    mostVoted,
    isTie,
    hiddenCaught,
    hiddenSurvived,
    hiddenPlayerId: hiddenId,
    hiddenWord: room.hiddenWord,
    product: room.product,
    reviews: room.reviews.map(r => ({
      ...r,
      playerName: room.players.find(p => p.id === r.playerId)?.name || 'Unknown',
      isHidden: r.playerId === hiddenId,
    })),
    scores: room.players.map(p => ({
      id: p.id,
      name: p.name,
      score: p.score,
      wasHidden: p.id === hiddenId,
      votedCorrectly: room.votes.find(v => v.voterId === p.id)?.votedFor === hiddenId,
    })),
  };
}

/**
 * Check if the game is over
 */
function isGameOver(room) {
  return room.round >= room.maxRounds;
}

/**
 * Get sanitized room state for clients (hides hidden player info during play)
 */
function getPublicRoomState(room, requestingPlayerId = null) {
  const base = {
    roomId: room.roomId,
    hostId: room.hostId,
    phase: room.phase,
    round: room.round,
    maxRounds: room.maxRounds,
    product: room.product,
    timerEnd: room.timerEnd,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      score: p.score,
      isConnected: p.isConnected,
      hasSubmittedReview: p.hasSubmittedReview,
      hasVoted: p.hasVoted,
    })),
  };

  // Only reveal hidden word to the hidden player during writing
  if (room.phase === PHASES.WRITING || room.phase === PHASES.PRODUCT_REVEAL) {
    if (requestingPlayerId === room.hiddenPlayerId) {
      base.hiddenWord = room.hiddenWord;
      base.isHidden = true;
    }
  }

  // During reveal and voting, show anonymized reviews
  if ([PHASES.REVEAL, PHASES.VOTING, PHASES.RESULTS].includes(room.phase)) {
    base.reviews = room.reviews.map((r, i) => ({
      index: i,
      text: r.text,
      playerId: room.phase === PHASES.RESULTS ? r.playerId : undefined,
      playerName: room.phase === PHASES.RESULTS
        ? (room.players.find(p => p.id === r.playerId)?.name || 'Unknown')
        : undefined,
    }));
  }

  return base;
}

module.exports = {
  PHASES,
  TIMERS,
  MIN_PLAYERS,
  MAX_PLAYERS,
  MAX_ROUNDS,
  createRoom,
  createPlayer,
  addPlayer,
  removePlayer,
  canStartGame,
  startNewRound,
  submitReview,
  submitVote,
  calculateResults,
  isGameOver,
  getPublicRoomState,
};

/**
 * Intentional - Game Controller
 * Manages game phase transitions and timer orchestration
 */

const {
  PHASES,
  TIMERS,
  startNewRound,
  calculateResults,
  isGameOver,
  getPublicRoomState,
} = require('../models/GameRoom');

// Active timers per room
const roomTimers = new Map();

/**
 * Clear any active timer for a room
 */
function clearRoomTimer(roomId) {
  if (roomTimers.has(roomId)) {
    clearTimeout(roomTimers.get(roomId));
    roomTimers.delete(roomId);
  }
}

/**
 * Set a timer for a room phase and emit timerUpdate
 */
function setPhaseTimer(io, roomId, duration, callback) {
  clearRoomTimer(roomId);
  const timer = setTimeout(() => {
    roomTimers.delete(roomId);
    callback();
  }, duration);
  roomTimers.set(roomId, timer);
}

/**
 * Transition to a new phase and broadcast to all clients
 */
function transitionPhase(io, rooms, roomId, newPhase) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.phase = newPhase;

  switch (newPhase) {
    case PHASES.PRODUCT_REVEAL: {
      startNewRound(room);
      room.timerEnd = Date.now() + TIMERS.PRODUCT_REVEAL;
      // Send state to each player individually (hidden player gets hidden word)
      emitPersonalizedState(io, room);
      setPhaseTimer(io, roomId, TIMERS.PRODUCT_REVEAL, () => {
        transitionPhase(io, rooms, roomId, PHASES.WRITING);
      });
      break;
    }

    case PHASES.WRITING: {
      room.timerEnd = Date.now() + TIMERS.WRITING;
      emitPersonalizedState(io, room);
      setPhaseTimer(io, roomId, TIMERS.WRITING, () => {
        // Auto-submit empty reviews for non-submitters
        room.players.forEach(p => {
          if (!p.hasSubmittedReview) {
            p.hasSubmittedReview = true;
            room.reviews.push({ playerId: p.id, text: '(No review submitted)' });
          }
        });
        transitionPhase(io, rooms, roomId, PHASES.REVEAL);
      });
      break;
    }

    case PHASES.REVEAL: {
      room.timerEnd = Date.now() + TIMERS.REVEAL;
      // Shuffle reviews so they are anonymous
      room.reviews = shuffleArray([...room.reviews]);
      emitPersonalizedState(io, room);
      setPhaseTimer(io, roomId, TIMERS.REVEAL, () => {
        transitionPhase(io, rooms, roomId, PHASES.VOTING);
      });
      break;
    }

    case PHASES.VOTING: {
      room.timerEnd = Date.now() + TIMERS.VOTING;
      emitPersonalizedState(io, room);
      setPhaseTimer(io, roomId, TIMERS.VOTING, () => {
        transitionPhase(io, rooms, roomId, PHASES.RESULTS);
      });
      break;
    }

    case PHASES.RESULTS: {
      clearRoomTimer(roomId);
      const results = calculateResults(room);
      room.timerEnd = Date.now() + TIMERS.RESULTS;

      // Broadcast results to all players
      io.to(roomId).emit('votingResults', results);
      io.to(roomId).emit('scoreboardUpdate', results.scores);
      emitPersonalizedState(io, room);

      setPhaseTimer(io, roomId, TIMERS.RESULTS, () => {
        if (isGameOver(room)) {
          transitionPhase(io, rooms, roomId, PHASES.WAITING);
        } else {
          transitionPhase(io, rooms, roomId, PHASES.NEXT_ROUND);
        }
      });
      break;
    }

    case PHASES.NEXT_ROUND: {
      room.timerEnd = Date.now() + TIMERS.NEXT_ROUND;
      emitPersonalizedState(io, room);
      setPhaseTimer(io, roomId, TIMERS.NEXT_ROUND, () => {
        transitionPhase(io, rooms, roomId, PHASES.PRODUCT_REVEAL);
      });
      break;
    }

    case PHASES.WAITING: {
      clearRoomTimer(roomId);
      room.round = 0;
      room.usedProducts = [];
      room.usedWords = [];
      room.players.forEach(p => {
        p.score = 0;
        p.isHidden = false;
        p.hasSubmittedReview = false;
        p.hasVoted = false;
        p.votedFor = null;
      });
      emitPersonalizedState(io, room);
      break;
    }
  }
}

/**
 * Send personalized game state to each player in the room
 * (Hidden player sees hidden word, others don't)
 */
function emitPersonalizedState(io, room) {
  const sockets = io.sockets.adapter.rooms.get(room.roomId);
  if (!sockets) return;

  for (const socketId of sockets) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      const state = getPublicRoomState(room, socketId);
      socket.emit('phaseChange', state);
      socket.emit('roomUpdate', state);
    }
  }
}

/**
 * Shuffle an array (Fisher-Yates)
 */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Clean up a room (remove timers, etc.)
 */
function cleanupRoom(roomId) {
  clearRoomTimer(roomId);
}

module.exports = {
  transitionPhase,
  emitPersonalizedState,
  cleanupRoom,
  clearRoomTimer,
};

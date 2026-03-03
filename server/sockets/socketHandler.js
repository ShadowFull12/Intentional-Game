/**
 * Intentional - Socket Event Handler
 * Handles all client ↔ server socket communication
 */

const {
  PHASES,
  createRoom,
  addPlayer,
  removePlayer,
  canStartGame,
  submitReview,
  submitVote,
  getPublicRoomState,
} = require('../models/GameRoom');

const { generateRoomCode } = require('../utils/roomCode');
const { validateNickname, validateRoomCode, validateReview } = require('../utils/validation');
const { transitionPhase, emitPersonalizedState, cleanupRoom } = require('../controllers/gameController');

/**
 * Initialize socket event handlers
 * @param {import('socket.io').Server} io
 * @param {Map<string, object>} rooms - In-memory rooms map
 */
function initSocketHandlers(io, rooms) {
  // Rate limiting per socket
  const rateLimits = new Map();

  function checkRateLimit(socketId, event, maxPerMinute = 30) {
    const key = `${socketId}:${event}`;
    const now = Date.now();
    if (!rateLimits.has(key)) {
      rateLimits.set(key, [now]);
      return true;
    }
    const timestamps = rateLimits.get(key).filter(t => now - t < 60000);
    if (timestamps.length >= maxPerMinute) return false;
    timestamps.push(now);
    rateLimits.set(key, timestamps);
    return true;
  }

  // Cleanup old rate limit entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of rateLimits.entries()) {
      const filtered = timestamps.filter(t => now - t < 60000);
      if (filtered.length === 0) rateLimits.delete(key);
      else rateLimits.set(key, filtered);
    }
  }, 300000);

  io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);
    let currentRoom = null;
    let playerName = null;

    // ─── CREATE ROOM ────────────────────────────────────────
    socket.on('createRoom', (data, callback) => {
      if (!checkRateLimit(socket.id, 'createRoom', 5)) {
        return callback?.({ success: false, error: 'Too many requests' });
      }

      const nameResult = validateNickname(data?.name);
      if (!nameResult.valid) {
        return callback?.({ success: false, error: nameResult.error });
      }

      const roomCode = generateRoomCode(new Set(rooms.keys()));
      const room = createRoom(roomCode, socket.id);
      rooms.set(roomCode, room);

      const addResult = addPlayer(room, socket.id, nameResult.value);
      if (!addResult.success) {
        rooms.delete(roomCode);
        return callback?.({ success: false, error: addResult.error });
      }

      socket.join(roomCode);
      currentRoom = roomCode;
      playerName = nameResult.value;

      console.log(`[Room] Created: ${roomCode} by ${playerName}`);
      callback?.({ success: true, roomId: roomCode, playerId: socket.id });
      emitPersonalizedState(io, room);
    });

    // ─── JOIN ROOM ──────────────────────────────────────────
    socket.on('joinRoom', (data, callback) => {
      if (!checkRateLimit(socket.id, 'joinRoom', 10)) {
        return callback?.({ success: false, error: 'Too many requests' });
      }

      const nameResult = validateNickname(data?.name);
      if (!nameResult.valid) {
        return callback?.({ success: false, error: nameResult.error });
      }

      const codeResult = validateRoomCode(data?.roomId);
      if (!codeResult.valid) {
        return callback?.({ success: false, error: codeResult.error });
      }

      const room = rooms.get(codeResult.value);
      if (!room) {
        return callback?.({ success: false, error: 'Room not found' });
      }

      const addResult = addPlayer(room, socket.id, nameResult.value);
      if (!addResult.success) {
        return callback?.({ success: false, error: addResult.error });
      }

      socket.join(codeResult.value);
      currentRoom = codeResult.value;
      playerName = nameResult.value;

      console.log(`[Room] ${playerName} joined ${currentRoom}`);
      callback?.({ success: true, roomId: codeResult.value, playerId: socket.id });
      emitPersonalizedState(io, room);
    });

    // ─── START GAME ─────────────────────────────────────────
    socket.on('startGame', (data, callback) => {
      if (!checkRateLimit(socket.id, 'startGame', 3)) {
        return callback?.({ success: false, error: 'Too many requests' });
      }

      if (!currentRoom) return callback?.({ success: false, error: 'Not in a room' });

      const room = rooms.get(currentRoom);
      if (!room) return callback?.({ success: false, error: 'Room not found' });
      if (room.hostId !== socket.id) {
        return callback?.({ success: false, error: 'Only the host can start the game' });
      }

      const check = canStartGame(room);
      if (!check.canStart) {
        return callback?.({ success: false, error: check.error });
      }

      console.log(`[Game] Starting in room ${currentRoom}`);
      callback?.({ success: true });
      transitionPhase(io, rooms, currentRoom, PHASES.PRODUCT_REVEAL);
    });

    // ─── SUBMIT REVIEW ──────────────────────────────────────
    socket.on('submitReview', (data, callback) => {
      if (!checkRateLimit(socket.id, 'submitReview', 5)) {
        return callback?.({ success: false, error: 'Too many requests' });
      }

      if (!currentRoom) return callback?.({ success: false, error: 'Not in a room' });

      const room = rooms.get(currentRoom);
      if (!room) return callback?.({ success: false, error: 'Room not found' });

      const reviewResult = validateReview(data?.text);
      if (!reviewResult.valid) {
        return callback?.({ success: false, error: reviewResult.error });
      }

      const result = submitReview(room, socket.id, reviewResult.value);
      if (!result.success) {
        return callback?.({ success: false, error: result.error });
      }

      console.log(`[Review] ${playerName} submitted in ${currentRoom}`);
      callback?.({ success: true });

      // Notify room about submission progress
      emitPersonalizedState(io, room);

      // If all players submitted, skip to reveal
      if (result.allSubmitted) {
        transitionPhase(io, rooms, currentRoom, PHASES.REVEAL);
      }
    });

    // ─── SUBMIT VOTE ────────────────────────────────────────
    socket.on('submitVote', (data, callback) => {
      if (!checkRateLimit(socket.id, 'submitVote', 5)) {
        return callback?.({ success: false, error: 'Too many requests' });
      }

      if (!currentRoom) return callback?.({ success: false, error: 'Not in a room' });

      const room = rooms.get(currentRoom);
      if (!room) return callback?.({ success: false, error: 'Room not found' });

      if (!data?.targetId) {
        return callback?.({ success: false, error: 'Invalid vote' });
      }

      const result = submitVote(room, socket.id, data.targetId);
      if (!result.success) {
        return callback?.({ success: false, error: result.error });
      }

      console.log(`[Vote] ${playerName} voted in ${currentRoom}`);
      callback?.({ success: true });

      emitPersonalizedState(io, room);

      // If all players voted, skip to results
      if (result.allVoted) {
        transitionPhase(io, rooms, currentRoom, PHASES.RESULTS);
      }
    });

    // ─── DISCONNECT ─────────────────────────────────────────
    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected: ${socket.id} (${playerName || 'unknown'})`);
      if (currentRoom) {
        const room = rooms.get(currentRoom);
        if (room) {
          const remaining = removePlayer(room, socket.id);
          if (remaining === 0) {
            // Clean up empty room
            cleanupRoom(currentRoom);
            rooms.delete(currentRoom);
            console.log(`[Room] Deleted empty room: ${currentRoom}`);
          } else {
            emitPersonalizedState(io, room);
            // If we're in a phase where this affects the game
            if (room.phase === PHASES.WRITING) {
              const allSubmitted = room.players.every(p => p.hasSubmittedReview);
              if (allSubmitted) transitionPhase(io, rooms, currentRoom, PHASES.REVEAL);
            }
            if (room.phase === PHASES.VOTING) {
              const allVoted = room.players.every(p => p.hasVoted);
              if (allVoted) transitionPhase(io, rooms, currentRoom, PHASES.RESULTS);
            }
          }
        }
      }
    });
  });
}

module.exports = { initSocketHandlers };

/**
 * Intentional - Main Server
 * Express + Socket.io real-time multiplayer game server
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { initSocketHandlers } = require('./sockets/socketHandler');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Build allowed origins list (supports multiple comma-separated URLs)
const allowedOrigins = CLIENT_URL.split(',').map(s => s.trim());

// ─── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed) || origin.includes('.vercel.app'))) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// HTTP rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ─── Socket.io Setup ────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.some(allowed => origin.startsWith(allowed) || origin.includes('.vercel.app'))) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// ─── In-memory game state ──────────────────────────────
const rooms = new Map();

// ─── Initialize socket handlers ─────────────────────────
initSocketHandlers(io, rooms);

// ─── Health check endpoint ──────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    rooms: rooms.size,
    uptime: process.uptime(),
  });
});

// ─── Room info endpoint (for debugging) ─────────────────
app.get('/api/rooms', (req, res) => {
  const roomList = [];
  for (const [id, room] of rooms.entries()) {
    roomList.push({
      id,
      phase: room.phase,
      players: room.players.length,
      round: room.round,
    });
  }
  res.json(roomList);
});

// ─── Cleanup stale rooms every 30 minutes ───────────────
setInterval(() => {
  const now = Date.now();
  const STALE_THRESHOLD = 60 * 60 * 1000; // 1 hour
  for (const [roomId, room] of rooms.entries()) {
    if (room.players.length === 0 || now - room.createdAt > STALE_THRESHOLD) {
      rooms.delete(roomId);
      console.log(`[Cleanup] Removed stale room: ${roomId}`);
    }
  }
}, 30 * 60 * 1000);

// ─── Start server ───────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🎮 Intentional server running on port ${PORT}`);
  console.log(`📡 Accepting connections from: ${CLIENT_URL}\n`);
});

module.exports = { app, server, io };

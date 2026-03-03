/**
 * Intentional - Game Context
 * Zustand store + React context for game state management
 */

import { createContext, useContext, useEffect, useRef } from 'react';
import { create } from 'zustand';
import { io } from 'socket.io-client';
import { playPhaseChange, playSubmit, playVote, playSuccess } from '../utils/sounds';

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

// ─── Zustand Store ──────────────────────────────────
export const useGameStore = create((set, get) => ({
  // Connection
  socket: null,
  connected: false,
  playerId: null,
  playerName: null,

  // Room
  roomId: null,
  hostId: null,
  players: [],

  // Game state
  phase: 'waiting',
  round: 0,
  maxRounds: 10,
  product: null,
  hiddenWord: null,
  isHidden: false,
  reviews: [],
  timerEnd: null,

  // UI state
  hasSubmittedReview: false,
  hasVoted: false,
  votingResults: null,
  scores: [],
  error: null,

  // ─── Actions ─────────────────────────────────────
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  initSocket: () => {
    const existing = get().socket;
    if (existing?.connected) return existing;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      set({ connected: true, playerId: socket.id });
      console.log('[Socket] Connected:', socket.id);
    });

    socket.on('disconnect', () => {
      set({ connected: false });
      console.log('[Socket] Disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
      set({ error: 'Failed to connect to server' });
    });

    // ─── Game Events ────────────────────────────────
    socket.on('roomUpdate', (state) => {
      set({
        roomId: state.roomId,
        hostId: state.hostId,
        players: state.players || [],
        phase: state.phase,
        round: state.round,
        maxRounds: state.maxRounds,
        product: state.product,
        timerEnd: state.timerEnd,
        reviews: state.reviews || [],
      });
    });

    socket.on('phaseChange', (state) => {
      // Play sound on phase transition
      try { playPhaseChange(); } catch (e) { /* ignore */ }

      const updates = {
        phase: state.phase,
        round: state.round,
        product: state.product,
        timerEnd: state.timerEnd,
        players: state.players || get().players,
        reviews: state.reviews || [],
        hostId: state.hostId,
      };

      // Reset per-round state on new phases
      if (state.phase === 'productReveal' || state.phase === 'writing') {
        updates.hasSubmittedReview = false;
        updates.hasVoted = false;
        updates.votingResults = null;
        updates.hiddenWord = state.hiddenWord || null;
        updates.isHidden = state.isHidden || false;
      }

      if (state.phase === 'voting') {
        updates.hasVoted = false;
      }

      if (state.phase === 'waiting') {
        updates.round = 0;
        updates.product = null;
        updates.hiddenWord = null;
        updates.isHidden = false;
        updates.reviews = [];
        updates.votingResults = null;
        updates.scores = [];
        updates.hasSubmittedReview = false;
        updates.hasVoted = false;
      }

      set(updates);
    });

    socket.on('votingResults', (results) => {
      set({ votingResults: results });
    });

    socket.on('scoreboardUpdate', (scores) => {
      set({ scores });
    });

    set({ socket });
    return socket;
  },

  createRoom: (name) => {
    return new Promise((resolve, reject) => {
      const socket = get().socket;
      if (!socket) return reject(new Error('Not connected'));

      socket.emit('createRoom', { name }, (response) => {
        if (response.success) {
          set({
            roomId: response.roomId,
            playerId: response.playerId,
            playerName: name,
            error: null,
          });
          resolve(response);
        } else {
          set({ error: response.error });
          reject(new Error(response.error));
        }
      });
    });
  },

  joinRoom: (roomId, name) => {
    return new Promise((resolve, reject) => {
      const socket = get().socket;
      if (!socket) return reject(new Error('Not connected'));

      socket.emit('joinRoom', { roomId, name }, (response) => {
        if (response.success) {
          set({
            roomId: response.roomId,
            playerId: response.playerId,
            playerName: name,
            error: null,
          });
          resolve(response);
        } else {
          set({ error: response.error });
          reject(new Error(response.error));
        }
      });
    });
  },

  startGame: () => {
    return new Promise((resolve, reject) => {
      const socket = get().socket;
      if (!socket) return reject(new Error('Not connected'));

      socket.emit('startGame', {}, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          set({ error: response.error });
          reject(new Error(response.error));
        }
      });
    });
  },

  submitReview: (text) => {
    return new Promise((resolve, reject) => {
      const socket = get().socket;
      if (!socket) return reject(new Error('Not connected'));

      socket.emit('submitReview', { text }, (response) => {
        if (response.success) {
          set({ hasSubmittedReview: true });
          try { playSubmit(); } catch (e) { /* ignore */ }
          resolve(response);
        } else {
          set({ error: response.error });
          reject(new Error(response.error));
        }
      });
    });
  },

  submitVote: (targetId) => {
    return new Promise((resolve, reject) => {
      const socket = get().socket;
      if (!socket) return reject(new Error('Not connected'));

      socket.emit('submitVote', { targetId }, (response) => {
        if (response.success) {
          set({ hasVoted: true });
          try { playVote(); } catch (e) { /* ignore */ }
          resolve(response);
        } else {
          set({ error: response.error });
          reject(new Error(response.error));
        }
      });
    });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
    }
    set({
      socket: null,
      connected: false,
      roomId: null,
      players: [],
      phase: 'waiting',
      round: 0,
      product: null,
      hiddenWord: null,
      isHidden: false,
      reviews: [],
      votingResults: null,
      scores: [],
      error: null,
      hasSubmittedReview: false,
      hasVoted: false,
    });
  },
}));

// ─── React Context Wrapper ─────────────────────────
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const initSocket = useGameStore((s) => s.initSocket);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initSocket();
      initialized.current = true;
    }
  }, [initSocket]);

  return (
    <GameContext.Provider value={null}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameContext = () => useContext(GameContext);

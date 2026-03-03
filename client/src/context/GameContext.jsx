/**
 * Intentional - Game Context (Firebase Realtime Database)
 * Zustand store + Firebase RTDB for real-time multiplayer state.
 * The host client acts as the authoritative game controller.
 */

import { createContext, useContext, useEffect, useRef } from 'react';
import { create } from 'zustand';
import {
  ref,
  set as dbSet,
  get as dbGet,
  update as dbUpdate,
  remove as dbRemove,
  onValue,
  onDisconnect as dbOnDisconnect,
} from 'firebase/database';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../utils/firebase';
import { getRandomProduct } from '../utils/productGenerator';
import { getRandomWord } from '../utils/wordGenerator';
import { playPhaseChange, playSubmit, playVote } from '../utils/sounds';

/* ─── Constants ─────────────────────────────────────── */
const PHASES = {
  WAITING: 'waiting',
  PRODUCT_REVEAL: 'productReveal',
  WRITING: 'writing',
  REVEAL: 'reveal',
  VOTING: 'voting',
  RESULTS: 'results',
  NEXT_ROUND: 'nextRound',
};

const DURATIONS = {
  productReveal: 5000,
  writing: 60000,
  reveal: 8000,
  voting: 30000,
  results: 10000,
  nextRound: 5000,
};

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 10;
const MAX_ROUNDS = 10;

/* ─── Module-level state (not serialized in store) ──── */
let _listeners = [];
let _phaseTimer = null;
let _transitioning = false;
let _usedProducts = [];
let _usedWords = [];

function clearPhaseTimer() {
  if (_phaseTimer) {
    clearTimeout(_phaseTimer);
    _phaseTimer = null;
  }
}

function detachAllListeners() {
  _listeners.forEach((fn) => { try { fn(); } catch (e) { /* noop */ } });
  _listeners = [];
  clearPhaseTimer();
  _transitioning = false;
}

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ═══════════════════════════════════════════════════════
   Zustand Store
   ═══════════════════════════════════════════════════════ */
export const useGameStore = create((set, get) => ({
  // Auth / Connection
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
  maxRounds: MAX_ROUNDS,
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

  // ─── Actions ─────────────────────────────────────────
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  /* ── Firebase Auth ──────────────────────────────────── */
  initAuth: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        set({ playerId: user.uid, connected: true });
      } else {
        try {
          const cred = await signInAnonymously(auth);
          set({ playerId: cred.user.uid, connected: true });
        } catch (err) {
          console.error('[Auth] Failed:', err);
          set({ error: 'Authentication failed', connected: false });
        }
      }
    });
  },

  /* ── Create Room ────────────────────────────────────── */
  createRoom: async (name) => {
    const { playerId } = get();
    if (!playerId) throw new Error('Not authenticated');

    const trimName = name.trim().substring(0, 20);
    if (trimName.length < 2) throw new Error('Name must be at least 2 characters');

    // Generate unique room code
    let roomCode = null;
    for (let i = 0; i < 20; i++) {
      const code = generateRoomCode();
      const snap = await dbGet(ref(db, `rooms/${code}/info`));
      if (!snap.exists()) { roomCode = code; break; }
    }
    if (!roomCode) throw new Error('Could not create room, try again');

    await dbUpdate(ref(db), {
      [`rooms/${roomCode}/info`]: {
        hostId: playerId,
        phase: PHASES.WAITING,
        round: 0,
        maxRounds: MAX_ROUNDS,
        product: null,
        timerEnd: null,
        createdAt: Date.now(),
      },
      [`rooms/${roomCode}/players/${playerId}`]: {
        name: trimName,
        score: 0,
        isConnected: true,
        hasSubmittedReview: false,
        hasVoted: false,
      },
    });

    // Mark disconnected on tab close
    await dbOnDisconnect(ref(db, `rooms/${roomCode}/players/${playerId}/isConnected`)).set(false);

    _usedProducts = [];
    _usedWords = [];
    set({ roomId: roomCode, playerName: trimName, error: null });
    get()._attachListeners(roomCode);
    return { roomId: roomCode };
  },

  /* ── Join Room ──────────────────────────────────────── */
  joinRoom: async (roomId, name) => {
    const { playerId } = get();
    if (!playerId) throw new Error('Not authenticated');

    const code = roomId.toUpperCase().trim();
    const trimName = name.trim().substring(0, 20);
    if (trimName.length < 2) throw new Error('Name must be at least 2 characters');
    if (!/^[A-Z]{4}$/.test(code)) throw new Error('Room code must be 4 letters');

    const infoSnap = await dbGet(ref(db, `rooms/${code}/info`));
    if (!infoSnap.exists()) throw new Error('Room not found');

    const info = infoSnap.val();
    if (info.phase !== PHASES.WAITING) throw new Error('Game already in progress');

    const playersSnap = await dbGet(ref(db, `rooms/${code}/players`));
    const existing = playersSnap.val() || {};
    if (Object.keys(existing).length >= MAX_PLAYERS) throw new Error('Room is full');

    const names = Object.values(existing).map((p) => p.name.toLowerCase());
    if (names.includes(trimName.toLowerCase())) throw new Error('Name already taken');

    await dbSet(ref(db, `rooms/${code}/players/${playerId}`), {
      name: trimName,
      score: 0,
      isConnected: true,
      hasSubmittedReview: false,
      hasVoted: false,
    });

    await dbOnDisconnect(ref(db, `rooms/${code}/players/${playerId}/isConnected`)).set(false);

    set({ roomId: code, playerName: trimName, error: null });
    get()._attachListeners(code);
    return { roomId: code };
  },

  /* ── Start Game (host only) ─────────────────────────── */
  startGame: async () => {
    const { roomId, playerId, hostId, players } = get();
    if (!roomId) throw new Error('Not in a room');
    if (playerId !== hostId) throw new Error('Only the host can start');
    if (players.length < MIN_PLAYERS) throw new Error(`Need at least ${MIN_PLAYERS} players`);

    _usedProducts = [];
    _usedWords = [];
    await get()._hostStartRound(roomId);
    return { success: true };
  },

  /* ── Submit Review ──────────────────────────────────── */
  submitReview: async (text) => {
    const { roomId, playerId, phase, hasSubmittedReview } = get();
    if (!roomId || !playerId) throw new Error('Not in a room');
    if (phase !== PHASES.WRITING) throw new Error('Not in writing phase');
    if (hasSubmittedReview) throw new Error('Already submitted');

    const clean = text.trim().substring(0, 200);
    if (!clean) throw new Error('Review cannot be empty');

    await dbUpdate(ref(db), {
      [`rooms/${roomId}/submissions/${playerId}`]: { text: clean },
      [`rooms/${roomId}/players/${playerId}/hasSubmittedReview`]: true,
    });

    set({ hasSubmittedReview: true });
    try { playSubmit(); } catch (e) { /* ignore */ }
    return { success: true };
  },

  /* ── Submit Vote ────────────────────────────────────── */
  submitVote: async (targetId) => {
    const { roomId, playerId, phase, hasVoted } = get();
    if (!roomId || !playerId) throw new Error('Not in a room');
    if (phase !== PHASES.VOTING) throw new Error('Not in voting phase');
    if (hasVoted) throw new Error('Already voted');
    if (targetId === playerId) throw new Error('Cannot vote for yourself');

    await dbUpdate(ref(db), {
      [`rooms/${roomId}/votes/${playerId}`]: targetId,
      [`rooms/${roomId}/players/${playerId}/hasVoted`]: true,
    });

    set({ hasVoted: true });
    try { playVote(); } catch (e) { /* ignore */ }
    return { success: true };
  },

  /* ── Disconnect / Leave ─────────────────────────────── */
  disconnect: async () => {
    const { roomId, playerId } = get();
    detachAllListeners();

    if (roomId && playerId) {
      try {
        await dbRemove(ref(db, `rooms/${roomId}/players/${playerId}`));
        const snap = await dbGet(ref(db, `rooms/${roomId}/players`));
        if (!snap.exists() || Object.keys(snap.val() || {}).length === 0) {
          await dbRemove(ref(db, `rooms/${roomId}`));
        }
      } catch (e) { /* best-effort cleanup */ }
    }

    set({
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

  /* ═══════════════════════════════════════════════════════
     Internal: RTDB Listeners
     ═══════════════════════════════════════════════════════ */
  _attachListeners: (roomId) => {
    detachAllListeners();
    const { playerId } = get();

    // 1. Room info
    const infoUnsub = onValue(ref(db, `rooms/${roomId}/info`), (snap) => {
      const data = snap.val();
      if (!data) {
        detachAllListeners();
        set({ roomId: null, error: 'Room no longer exists', phase: 'waiting' });
        return;
      }

      const prev = get().phase;
      const updates = {
        hostId: data.hostId,
        phase: data.phase || 'waiting',
        round: data.round || 0,
        maxRounds: data.maxRounds || MAX_ROUNDS,
        product: data.product || null,
        timerEnd: data.timerEnd || null,
      };

      // Reset per-phase state on phase change
      if (data.phase !== prev) {
        try { playPhaseChange(); } catch (e) { /* ignore */ }

        if (data.phase === 'productReveal' || data.phase === 'writing') {
          updates.hasSubmittedReview = false;
          updates.hasVoted = false;
          updates.votingResults = null;
          updates.reviews = [];
        }
        if (data.phase === 'voting') {
          updates.hasVoted = false;
        }
        if (data.phase === 'waiting') {
          Object.assign(updates, {
            hiddenWord: null, isHidden: false, reviews: [],
            votingResults: null, scores: [], hasSubmittedReview: false, hasVoted: false,
          });
        }
      }
      set(updates);
    });
    _listeners.push(infoUnsub);

    // 2. Players
    const playersUnsub = onValue(ref(db, `rooms/${roomId}/players`), (snap) => {
      const data = snap.val() || {};
      const players = Object.entries(data).map(([id, p]) => ({
        id,
        name: p.name,
        score: p.score || 0,
        isConnected: p.isConnected !== false,
        hasSubmittedReview: p.hasSubmittedReview || false,
        hasVoted: p.hasVoted || false,
      }));
      set({ players });

      // Host: check if everyone submitted / voted to advance early
      const s = get();
      if (s.playerId === s.hostId && players.length > 0 && !_transitioning) {
        if (s.phase === PHASES.WRITING && players.every((p) => p.hasSubmittedReview)) {
          get()._hostCollectReviews(roomId);
        }
        if (s.phase === PHASES.VOTING && players.every((p) => p.hasVoted)) {
          get()._hostCalculateResults(roomId);
        }
      }
    });
    _listeners.push(playersUnsub);

    // 3. My secret (hidden word if I'm the hidden player)
    const secretUnsub = onValue(ref(db, `rooms/${roomId}/secret/${playerId}`), (snap) => {
      const data = snap.val();
      set({
        hiddenWord: data?.hiddenWord || null,
        isHidden: data?.isHidden || false,
      });
    });
    _listeners.push(secretUnsub);

    // 4. Anonymous reviews
    const reviewsUnsub = onValue(ref(db, `rooms/${roomId}/reviews`), (snap) => {
      const data = snap.val();
      if (data) {
        const reviews = Array.isArray(data) ? data.filter(Boolean) : Object.values(data);
        set({ reviews });
      } else {
        set({ reviews: [] });
      }
    });
    _listeners.push(reviewsUnsub);

    // 5. Results
    const resultsUnsub = onValue(ref(db, `rooms/${roomId}/results`), (snap) => {
      const data = snap.val();
      if (data) {
        set({ votingResults: data, scores: data.scores || [] });
      }
    });
    _listeners.push(resultsUnsub);
  },

  /* ═══════════════════════════════════════════════════════
     Internal: Host Game Controller
     ═══════════════════════════════════════════════════════ */

  /** Start a new round — pick product, word, hidden player */
  _hostStartRound: async (roomId) => {
    clearPhaseTimer();
    _transitioning = true;

    const { players, round } = get();
    const newRound = (round || 0) + 1;

    const product = getRandomProduct(_usedProducts);
    const word = getRandomWord(_usedWords);
    _usedProducts.push(product);
    _usedWords.push(word);

    const playerIds = players.map((p) => p.id);
    const hiddenId = playerIds[Math.floor(Math.random() * playerIds.length)];

    const updates = {};
    // Clear old round data
    updates[`rooms/${roomId}/submissions`] = null;
    updates[`rooms/${roomId}/reviews`] = null;
    updates[`rooms/${roomId}/votes`] = null;
    updates[`rooms/${roomId}/results`] = null;
    updates[`rooms/${roomId}/secret`] = null;
    updates[`rooms/${roomId}/hostData`] = { hiddenPlayerId: hiddenId, hiddenWord: word };

    // Reset player states
    playerIds.forEach((pid) => {
      updates[`rooms/${roomId}/players/${pid}/hasSubmittedReview`] = false;
      updates[`rooms/${roomId}/players/${pid}/hasVoted`] = false;
    });

    // Room info
    updates[`rooms/${roomId}/info/phase`] = PHASES.PRODUCT_REVEAL;
    updates[`rooms/${roomId}/info/round`] = newRound;
    updates[`rooms/${roomId}/info/product`] = product;
    updates[`rooms/${roomId}/info/timerEnd`] = Date.now() + DURATIONS.productReveal;

    // Secret for hidden player (only they can read it via security rules)
    updates[`rooms/${roomId}/secret/${hiddenId}`] = { hiddenWord: word, isHidden: true };

    await dbUpdate(ref(db), updates);
    _transitioning = false;

    _phaseTimer = setTimeout(() => {
      get()._hostSetPhase(roomId, PHASES.WRITING, DURATIONS.writing);
    }, DURATIONS.productReveal);
  },

  /** Transition to a specific phase with timer */
  _hostSetPhase: async (roomId, phase, duration) => {
    if (_transitioning) return;
    clearPhaseTimer();
    _transitioning = true;

    await dbUpdate(ref(db, `rooms/${roomId}/info`), {
      phase,
      timerEnd: Date.now() + duration,
    });
    _transitioning = false;

    // Schedule auto-advance
    if (phase === PHASES.WRITING) {
      _phaseTimer = setTimeout(() => get()._hostCollectReviews(roomId), duration);
    } else if (phase === PHASES.REVEAL) {
      _phaseTimer = setTimeout(() => {
        get()._hostSetPhase(roomId, PHASES.VOTING, DURATIONS.voting);
      }, duration);
    } else if (phase === PHASES.VOTING) {
      _phaseTimer = setTimeout(() => get()._hostCalculateResults(roomId), duration);
    } else if (phase === PHASES.RESULTS) {
      _phaseTimer = setTimeout(async () => {
        const snap = await dbGet(ref(db, `rooms/${roomId}/info`));
        const info = snap.val();
        if (info && info.round >= MAX_ROUNDS) {
          // Game over — go to waiting
          await dbUpdate(ref(db, `rooms/${roomId}/info`), {
            phase: PHASES.WAITING, round: 0, timerEnd: null,
          });
        } else {
          get()._hostSetPhase(roomId, PHASES.NEXT_ROUND, DURATIONS.nextRound);
        }
      }, duration);
    } else if (phase === PHASES.NEXT_ROUND) {
      _phaseTimer = setTimeout(() => get()._hostStartRound(roomId), duration);
    }
  },

  /** Collect all submissions, shuffle, and reveal anonymized reviews */
  _hostCollectReviews: async (roomId) => {
    if (_transitioning) return;
    clearPhaseTimer();
    _transitioning = true;

    const { players } = get();
    const subSnap = await dbGet(ref(db, `rooms/${roomId}/submissions`));
    const submissions = subSnap.val() || {};

    const reviewData = players.map((p) => ({
      text: submissions[p.id]?.text || '(No review submitted)',
      playerId: p.id,
      playerName: p.name,
    }));
    const shuffled = shuffleArray(reviewData);
    const anonReviews = shuffled.map((r) => ({ text: r.text }));

    await dbUpdate(ref(db), {
      [`rooms/${roomId}/reviews`]: anonReviews,
      [`rooms/${roomId}/hostData/fullReviews`]: shuffled,
      [`rooms/${roomId}/info/phase`]: PHASES.REVEAL,
      [`rooms/${roomId}/info/timerEnd`]: Date.now() + DURATIONS.reveal,
    });

    _transitioning = false;

    _phaseTimer = setTimeout(() => {
      get()._hostSetPhase(roomId, PHASES.VOTING, DURATIONS.voting);
    }, DURATIONS.reveal);
  },

  /** Tally votes, compute scores, publish results */
  _hostCalculateResults: async (roomId) => {
    if (_transitioning) return;
    clearPhaseTimer();
    _transitioning = true;

    // Read fresh player data from RTDB
    const playersSnap = await dbGet(ref(db, `rooms/${roomId}/players`));
    const playersData = playersSnap.val() || {};
    const players = Object.entries(playersData).map(([id, p]) => ({
      id, name: p.name, score: p.score || 0,
    }));

    const hostSnap = await dbGet(ref(db, `rooms/${roomId}/hostData`));
    const hostData = hostSnap.val() || {};
    const hiddenId = hostData.hiddenPlayerId;
    const hiddenWord = hostData.hiddenWord;
    const fullReviews = hostData.fullReviews || [];

    const votesSnap = await dbGet(ref(db, `rooms/${roomId}/votes`));
    const votes = votesSnap.val() || {};

    // Count votes per player
    const voteCounts = {};
    players.forEach((p) => { voteCounts[p.id] = 0; });
    Object.values(votes).forEach((targetId) => {
      if (voteCounts[targetId] !== undefined) voteCounts[targetId]++;
    });

    // Find who got the most votes
    let maxVotes = 0;
    let mostVoted = [];
    for (const [pid, count] of Object.entries(voteCounts)) {
      if (count > maxVotes) { maxVotes = count; mostVoted = [pid]; }
      else if (count === maxVotes && count > 0) mostVoted.push(pid);
    }

    const isTie = mostVoted.length > 1;
    const hiddenCaught = !isTie && mostVoted.includes(hiddenId);

    // Scoring: +3 to hidden player if they survived, +2 to each correct voter
    const scoreUpdates = {};
    const newScores = {};
    players.forEach((p) => { newScores[p.id] = p.score; });

    if (!hiddenCaught) {
      newScores[hiddenId] = (newScores[hiddenId] || 0) + 3;
    }
    Object.entries(votes).forEach(([voterId, targetId]) => {
      if (targetId === hiddenId) {
        newScores[voterId] = (newScores[voterId] || 0) + 2;
      }
    });

    // Write score updates
    players.forEach((p) => {
      if (newScores[p.id] !== p.score) {
        scoreUpdates[`rooms/${roomId}/players/${p.id}/score`] = newScores[p.id];
      }
    });

    const results = {
      voteCounts,
      mostVoted,
      isTie,
      hiddenCaught,
      hiddenSurvived: !hiddenCaught,
      hiddenPlayerId: hiddenId,
      hiddenWord,
      reviews: fullReviews.map((r) => ({
        ...r,
        isHidden: r.playerId === hiddenId,
      })),
      scores: players.map((p) => ({
        id: p.id,
        name: p.name,
        score: newScores[p.id],
        wasHidden: p.id === hiddenId,
        votedCorrectly: votes[p.id] === hiddenId,
      })),
      product: get().product,
    };

    await dbUpdate(ref(db), {
      ...scoreUpdates,
      [`rooms/${roomId}/results`]: results,
      [`rooms/${roomId}/info/phase`]: PHASES.RESULTS,
      [`rooms/${roomId}/info/timerEnd`]: Date.now() + DURATIONS.results,
    });

    _transitioning = false;

    _phaseTimer = setTimeout(async () => {
      const snap = await dbGet(ref(db, `rooms/${roomId}/info`));
      const info = snap.val();
      if (info && info.round >= MAX_ROUNDS) {
        await dbUpdate(ref(db, `rooms/${roomId}/info`), {
          phase: PHASES.WAITING, round: 0, timerEnd: null,
        });
      } else {
        get()._hostSetPhase(roomId, PHASES.NEXT_ROUND, DURATIONS.nextRound);
      }
    }, DURATIONS.results);
  },
}));

/* ─── React Context Wrapper ─────────────────────────── */
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const initAuth = useGameStore((s) => s.initAuth);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initAuth();
      initialized.current = true;
    }
  }, [initAuth]);

  return (
    <GameContext.Provider value={null}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameContext = () => useContext(GameContext);

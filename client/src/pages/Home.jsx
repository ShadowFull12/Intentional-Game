/**
 * Intentional - Home Page
 * Landing screen with create/join room options
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../context/GameContext';

export default function Home() {
  const [mode, setMode] = useState(null); // 'create' | 'join'
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createRoom = useGameStore((s) => s.createRoom);
  const joinRoom = useGameStore((s) => s.joinRoom);
  const connected = useGameStore((s) => s.connected);
  const error = useGameStore((s) => s.error);
  const clearError = useGameStore((s) => s.clearError);

  const handleCreate = async () => {
    if (!name.trim() || loading) return;
    setLoading(true);
    clearError();
    try {
      await createRoom(name.trim());
      navigate('/lobby');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!name.trim() || !roomCode.trim() || loading) return;
    setLoading(true);
    clearError();
    try {
      await joinRoom(roomCode.trim().toUpperCase(), name.trim());
      navigate('/lobby');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      {/* Logo & Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center mb-12"
      >
        <motion.h1
          className="text-6xl md:text-8xl font-display font-bold tracking-tight relative select-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Base violet text */}
          <span className="text-accent" style={{ textShadow: '0 0 10px rgba(139,92,246,0.4)' }}>
            Intentional
          </span>
          {/* Flashlight overlay — white text masked by animated spotlight */}
          <span
            aria-hidden="true"
            className="absolute inset-0 text-white flashlight-sweep pointer-events-none"
            style={{ textShadow: '0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(139,92,246,0.3)' }}
          >
            Intentional
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/40 mt-3 text-lg font-light"
        >
          Write. Deceive. Detect.
        </motion.p>
      </motion.div>

      {/* Connection status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mb-6 flex items-center gap-2"
      >
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-neon-green animate-pulse' : 'bg-red-500'}`} />
        <span className="text-xs text-white/30">
          {connected ? 'Ready' : 'Connecting...'}
        </span>
      </motion.div>

      {/* Main action area */}
      <AnimatePresence mode="wait">
        {!mode ? (
          // Mode selection
          <motion.div
            key="mode-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode('create')}
              disabled={!connected}
              className="btn-primary text-lg px-10 py-4 min-w-[200px]"
            >
              Create Room
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode('join')}
              disabled={!connected}
              className="btn-secondary text-lg px-10 py-4 min-w-[200px]"
            >
              Join Room
            </motion.button>
          </motion.div>
        ) : (
          // Form
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card w-full max-w-sm"
          >
            <h2 className="text-xl font-display font-semibold mb-6 text-center">
              {mode === 'create' ? 'Create a Room' : 'Join a Room'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your nickname"
                  maxLength={20}
                  className="input-field"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (mode === 'create') handleCreate();
                      else if (roomCode.trim()) handleJoin();
                    }
                  }}
                />
              </div>

              {mode === 'join' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Room Code</label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="ABCD"
                    maxLength={4}
                    className="input-field text-center text-2xl tracking-[0.5em] font-display font-bold uppercase"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleJoin();
                    }}
                  />
                </motion.div>
              )}

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setMode(null); clearError(); }}
                  className="btn-secondary flex-1"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={mode === 'create' ? handleCreate : handleJoin}
                  disabled={loading || !name.trim() || (mode === 'join' && !roomCode.trim())}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <svg className="w-5 h-5 animate-spin mx-auto" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75" />
                    </svg>
                  ) : mode === 'create' ? 'Create' : 'Join'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-12 text-center"
      >
        <p className="text-white/20 text-xs">
          3–10 players · Write fake reviews · Spot the hidden word
        </p>
      </motion.div>
    </div>
  );
}

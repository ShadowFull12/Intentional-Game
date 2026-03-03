/**
 * Intentional - Lobby Page
 * Pre-game room where players wait and the host starts the game
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../context/GameContext';
import PlayerList from '../components/PlayerList';

export default function Lobby() {
  const navigate = useNavigate();

  const roomId = useGameStore((s) => s.roomId);
  const hostId = useGameStore((s) => s.hostId);
  const playerId = useGameStore((s) => s.playerId);
  const players = useGameStore((s) => s.players);
  const phase = useGameStore((s) => s.phase);
  const startGame = useGameStore((s) => s.startGame);
  const error = useGameStore((s) => s.error);
  const clearError = useGameStore((s) => s.clearError);

  const isHost = playerId === hostId;
  const canStart = players.length >= 3;

  // Redirect if no room
  useEffect(() => {
    if (!roomId) {
      navigate('/');
    }
  }, [roomId, navigate]);

  // Navigate to game when phase changes
  useEffect(() => {
    if (phase && phase !== 'waiting') {
      navigate('/game');
    }
  }, [phase, navigate]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId);
  };

  const handleStart = async () => {
    clearError();
    try {
      await startGame();
    } catch (err) {
      console.error(err);
    }
  };

  if (!roomId) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      {/* Room Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-display font-bold mb-2">
          <span className="text-white/60">Room</span>{' '}
          <span className="neon-text">{roomId}</span>
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopyCode}
          className="text-xs text-white/30 hover:text-accent transition-colors flex items-center gap-1 mx-auto"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy code to share
        </motion.button>
      </motion.div>

      {/* Player List Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider">
            Players ({players.length}/10)
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${canStart ? 'bg-neon-green/10 text-neon-green' : 'bg-white/5 text-white/30'}`}>
            {canStart ? 'Ready' : `Need ${3 - players.length} more`}
          </span>
        </div>

        <PlayerList
          players={players}
          hostId={hostId}
          currentPlayerId={playerId}
        />

        {/* Start button (host only) */}
        <div className="mt-6">
          {isHost ? (
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                disabled={!canStart}
                className="btn-primary w-full text-lg py-4"
              >
                {canStart ? 'Start Game' : `Waiting for ${3 - players.length} more player${3 - players.length === 1 ? '' : 's'}...`}
              </motion.button>
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
            </div>
          ) : (
            <div className="text-center p-4 rounded-xl bg-white/5">
              <p className="text-white/40 text-sm">
                Waiting for the host to start the game...
              </p>
              <div className="mt-2 flex justify-center">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-accent/50"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* How to play hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 glass rounded-2xl p-4 max-w-md w-full"
      >
        <h4 className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">How to Play</h4>
        <div className="space-y-2 text-xs text-white/40">
          <p>📦 A random product is shown each round</p>
          <p>🤫 One player secretly receives a hidden word</p>
          <p>✍️ Everyone writes a fake review (200 chars max)</p>
          <p>🗳️ Vote on who you think had the hidden word</p>
          <p>🏆 Score points for guessing right or staying hidden!</p>
        </div>
      </motion.div>
    </div>
  );
}

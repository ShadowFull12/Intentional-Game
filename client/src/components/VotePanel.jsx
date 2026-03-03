/**
 * Intentional - VotePanel Component
 * Shows players to vote for, with anonymous reviews alongside
 */

import { motion } from 'framer-motion';
import { useGameStore } from '../context/GameContext';

export default function VotePanel() {
  const players = useGameStore((s) => s.players);
  const playerId = useGameStore((s) => s.playerId);
  const hasVoted = useGameStore((s) => s.hasVoted);
  const submitVote = useGameStore((s) => s.submitVote);

  const handleVote = async (targetId) => {
    if (hasVoted) return;
    try {
      await submitVote(targetId);
    } catch (err) {
      console.error('Vote failed:', err.message);
    }
  };

  const otherPlayers = players.filter(p => p.id !== playerId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <h3 className="text-center text-lg font-display font-semibold text-white/80 mb-6">
        {hasVoted ? 'Vote submitted! Waiting for others...' : 'Who had the hidden word?'}
      </h3>

      <div className="space-y-3">
        {otherPlayers.map((player, i) => (
          <motion.button
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={!hasVoted ? { scale: 1.02, x: 4 } : {}}
            whileTap={!hasVoted ? { scale: 0.98 } : {}}
            onClick={() => handleVote(player.id)}
            disabled={hasVoted}
            className={`
              w-full p-4 glass rounded-2xl text-left transition-all duration-300
              flex items-center justify-between group
              ${hasVoted
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-accent/10 hover:border-accent/30 cursor-pointer'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-sm font-bold text-accent">
                  {player.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <span className="font-medium text-white/90">{player.name}</span>
                {player.hasVoted && (
                  <span className="ml-2 text-xs text-white/30">voted</span>
                )}
              </div>
            </div>

            {!hasVoted && (
              <motion.div
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Voting progress */}
      <div className="mt-6 text-center">
        <div className="text-xs text-white/30">
          {players.filter(p => p.hasVoted).length} / {players.length} voted
        </div>
        <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent/60 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(players.filter(p => p.hasVoted).length / players.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

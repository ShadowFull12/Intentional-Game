/**
 * Intentional - ScoreBoard Component
 * Animated scoreboard with rankings
 */

import { motion, AnimatePresence } from 'framer-motion';

export default function ScoreBoard({ scores, compact = false }) {
  // Sort by score descending
  const sorted = [...(scores || [])].sort((a, b) => b.score - a.score);

  if (compact) {
    return (
      <div className="glass rounded-2xl p-4">
        <h4 className="text-xs uppercase tracking-wider text-white/30 mb-3 font-medium">Scores</h4>
        <div className="space-y-2">
          {sorted.map((player, i) => (
            <div key={player.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-white/30 text-xs w-4">{i + 1}.</span>
                <span className="text-white/70">{player.name}</span>
              </div>
              <span className="font-bold text-accent">{player.score}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card max-w-md mx-auto w-full"
    >
      <h3 className="text-center text-lg font-display font-semibold text-white/80 mb-6">
        Scoreboard
      </h3>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sorted.map((player, i) => (
            <motion.div
              key={player.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
              className={`
                flex items-center justify-between p-3 rounded-xl
                ${i === 0 ? 'bg-accent/15 border border-accent/20' : 'bg-white/5'}
                ${player.wasHidden ? 'ring-1 ring-accent/30' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                {/* Rank badge */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${i === 0 ? 'bg-accent text-white' : i === 1 ? 'bg-white/20 text-white/80' : 'bg-white/10 text-white/50'}
                `}>
                  {i + 1}
                </div>
                <div>
                  <span className="font-medium text-white/90">{player.name}</span>
                  {player.wasHidden && (
                    <span className="ml-2 text-xs text-accent/60">hidden</span>
                  )}
                  {player.votedCorrectly && (
                    <span className="ml-2 text-xs text-neon-green">✓ correct</span>
                  )}
                </div>
              </div>

              <motion.div
                key={player.score}
                initial={{ scale: 1.3, color: '#8b5cf6' }}
                animate={{ scale: 1, color: '#ffffff' }}
                className="text-lg font-bold font-display"
              >
                {player.score}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

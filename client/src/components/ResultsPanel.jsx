/**
 * Intentional - Results Panel Component
 * Shows voting results with reveals and animations
 */

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import ScoreBoard from './ScoreBoard';

export default function ResultsPanel({ results, onConfetti }) {
  useEffect(() => {
    // Trigger confetti for hidden player survival or correct guess
    if (results && onConfetti) {
      onConfetti();
    }
  }, [results, onConfetti]);

  if (!results) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-lg mx-auto"
    >
      {/* Round outcome banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className={`glass-card text-center ${results.hiddenCaught ? 'border-neon-green/30' : 'border-accent/30'}`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-4xl mb-3"
        >
          {results.hiddenCaught ? '🎯' : '🫣'}
        </motion.div>
        <h3 className="text-xl font-display font-bold mb-2">
          {results.hiddenCaught ? 'Hidden Player Caught!' : results.isTie ? 'It\'s a Tie!' : 'Hidden Player Survived!'}
        </h3>
        <p className="text-white/50 text-sm">
          The hidden word was <span className="text-accent font-semibold">"{results.hiddenWord}"</span>
        </p>
        <p className="text-white/40 text-xs mt-1">
          Product: {typeof results.product === 'object' ? results.product.name : results.product}
        </p>
      </motion.div>

      {/* Vote breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card"
      >
        <h4 className="text-sm font-medium text-white/40 mb-3 uppercase tracking-wider">Vote Breakdown</h4>
        <div className="space-y-2">
          {Object.entries(results.voteCounts).map(([playerId, count]) => {
            const player = results.scores.find(s => s.id === playerId);
            const isHidden = playerId === results.hiddenPlayerId;
            return (
              <div key={playerId} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isHidden ? 'text-accent font-semibold' : 'text-white/70'}`}>
                    {player?.name || 'Unknown'}
                  </span>
                  {isHidden && <span className="text-xs text-accent/60">(hidden)</span>}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${isHidden ? 'bg-accent' : 'bg-white/20'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${count > 0 ? (count / results.scores.length) * 100 : 0}%` }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    />
                  </div>
                  <span className="text-xs text-white/40 w-4 text-right">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Reviews with authors revealed */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card"
      >
        <h4 className="text-sm font-medium text-white/40 mb-3 uppercase tracking-wider">Reviews Revealed</h4>
        <div className="space-y-3">
          {results.reviews.map((review, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl ${review.isHidden ? 'bg-accent/10 border border-accent/20' : 'bg-white/5'}`}
            >
              <p className="text-sm text-white/80">"{review.text}"</p>
              <p className={`text-xs mt-1 ${review.isHidden ? 'text-accent' : 'text-white/30'}`}>
                — {review.playerName} {review.isHidden ? '🎯 Hidden Word Player' : ''}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scoreboard */}
      <ScoreBoard scores={results.scores} />
    </motion.div>
  );
}

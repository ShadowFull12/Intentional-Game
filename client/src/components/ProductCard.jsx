/**
 * Intentional - ProductCard Component
 * Shows the current fictional product with animated reveal
 */

import { motion } from 'framer-motion';

export default function ProductCard({ product, hiddenWord, isHidden }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="glass-card text-center max-w-md mx-auto"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs uppercase tracking-widest text-accent/60 mb-3 font-medium"
      >
        Review this product
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-2xl md:text-3xl font-display font-bold text-white mb-4"
      >
        {product}
      </motion.h2>

      {isHidden && hiddenWord && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
          className="mt-4 p-4 rounded-2xl bg-accent/10 border border-accent/30 neon-border"
        >
          <p className="text-xs text-accent/70 uppercase tracking-wider mb-1">
            Your hidden word
          </p>
          <p className="text-xl font-display font-bold neon-text">
            {hiddenWord}
          </p>
          <p className="text-xs text-white/30 mt-2">
            Include this word naturally in your review
          </p>
        </motion.div>
      )}

      {!isHidden && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 p-3 rounded-2xl bg-white/5 border border-white/5"
        >
          <p className="text-sm text-white/40">
            Write your best review. Someone has a hidden word — can you spot them?
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

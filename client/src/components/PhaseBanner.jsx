/**
 * Intentional - Phase Banner Component
 * Shows current game phase with animated transitions
 */

import { motion, AnimatePresence } from 'framer-motion';

const PHASE_INFO = {
  waiting: { label: 'Waiting', emoji: '⏳', color: 'text-white/40' },
  productReveal: { label: 'New Product!', emoji: '📦', color: 'text-accent' },
  writing: { label: 'Writing Phase', emoji: '✍️', color: 'text-neon-blue' },
  reveal: { label: 'Reviews Revealed', emoji: '👀', color: 'text-neon-pink' },
  voting: { label: 'Vote Now', emoji: '🗳️', color: 'text-neon-purple' },
  results: { label: 'Results', emoji: '🏆', color: 'text-neon-green' },
  nextRound: { label: 'Next Round...', emoji: '🔄', color: 'text-accent' },
};

export default function PhaseBanner({ phase }) {
  const info = PHASE_INFO[phase] || PHASE_INFO.waiting;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="text-center"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
          className="text-3xl inline-block mb-1"
        >
          {info.emoji}
        </motion.span>
        <h2 className={`text-lg font-display font-bold ${info.color} uppercase tracking-widest`}>
          {info.label}
        </h2>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Intentional - ReviewCard Component
 * Displays a single anonymous review with glassmorphism styling
 */

import { motion } from 'framer-motion';

export default function ReviewCard({ review, index, showAuthor = false, isHighlighted = false, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
      whileHover={onClick ? { scale: 1.02, borderColor: 'rgba(139, 92, 246, 0.4)' } : {}}
      onClick={onClick}
      className={`
        glass-card relative transition-all duration-300
        ${onClick ? 'cursor-pointer hover:shadow-glass-lg' : ''}
        ${isHighlighted ? 'neon-border bg-accent/10' : ''}
      `}
    >
      {/* Review Number Badge */}
      <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
        <span className="text-xs font-bold text-accent">#{index + 1}</span>
      </div>

      {/* Review Text */}
      <p className="text-white/90 leading-relaxed text-sm md:text-base mt-2">
        "{review.text}"
      </p>

      {/* Author (shown in results) */}
      {showAuthor && review.playerName && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 flex items-center gap-2"
        >
          <div className={`w-2 h-2 rounded-full ${review.isHidden ? 'bg-accent animate-pulse' : 'bg-white/20'}`} />
          <span className={`text-xs font-medium ${review.isHidden ? 'text-accent' : 'text-white/40'}`}>
            {review.playerName}
            {review.isHidden && ' — Had the hidden word!'}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

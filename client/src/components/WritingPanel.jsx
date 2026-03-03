/**
 * Intentional - Writing Panel Component
 * Text input for writing reviews with character counter
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../context/GameContext';

const MAX_CHARS = 200;

export default function WritingPanel() {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSubmittedReview = useGameStore((s) => s.hasSubmittedReview);
  const submitReview = useGameStore((s) => s.submitReview);
  const product = useGameStore((s) => s.product);

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isEmpty = text.trim().length === 0;

  const handleSubmit = async () => {
    if (isOverLimit || isEmpty || isSubmitting || hasSubmittedReview) return;
    setIsSubmitting(true);
    try {
      await submitReview(text.trim());
    } catch (err) {
      console.error('Submit failed:', err.message);
    }
    setIsSubmitting(false);
  };

  if (hasSubmittedReview) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-green/20 flex items-center justify-center"
        >
          <svg className="w-8 h-8 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <p className="text-white/60 font-medium">Review submitted!</p>
        <p className="text-white/30 text-sm mt-1">Waiting for other players...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card max-w-md mx-auto"
    >
      <label className="block text-sm text-white/40 mb-2 font-medium">
        Write your review for <span className="text-accent">{typeof product === 'object' ? product?.name : product}</span>
      </label>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="This product changed my life..."
        rows={4}
        maxLength={MAX_CHARS + 10}
        className="input-field resize-none text-sm leading-relaxed"
        autoFocus
      />

      <div className="flex items-center justify-between mt-3">
        <div className={`text-xs font-medium ${isOverLimit ? 'text-red-400' : charCount > 150 ? 'text-yellow-400' : 'text-white/30'}`}>
          {charCount}/{MAX_CHARS}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isOverLimit || isEmpty || isSubmitting}
          className="btn-primary text-sm px-5 py-2"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75" />
              </svg>
              Sending...
            </span>
          ) : 'Submit Review'}
        </motion.button>
      </div>

      {/* Character limit warning bar */}
      <div className="mt-2 w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isOverLimit ? 'bg-red-500' : charCount > 150 ? 'bg-yellow-500' : 'bg-accent/50'}`}
          animate={{ width: `${Math.min(100, (charCount / MAX_CHARS) * 100)}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
}

/**
 * Intentional - ProductCard Component
 * Amazon-style mock product page with description, price, rating
 */

import { motion } from 'framer-motion';

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {hasHalf && (
        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs><clipPath id="halfClip"><rect x="0" y="0" width="10" height="20" /></clipPath></defs>
          <path clipPath="url(#halfClip)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          <path className="text-white/10" fill="currentColor" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e${i}`} className="w-4 h-4 text-white/10" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export default function ProductCard({ product, hiddenWord, isHidden }) {
  // product can be a string (legacy) or an object with full metadata
  const name = typeof product === 'object' ? product.name : product;
  const description = typeof product === 'object' ? product.description : null;
  const price = typeof product === 'object' ? product.price : null;
  const rating = typeof product === 'object' ? product.rating : null;
  const reviewCount = typeof product === 'object' ? product.reviews : null;
  const category = typeof product === 'object' ? product.category : null;
  const imageUrl = typeof product === 'object' ? product.imageUrl : null;

  // Category-based gradient fallback when no AI image
  const categoryGradients = {
    Kitchen: 'from-orange-500/20 to-amber-600/20',
    Tech: 'from-blue-500/20 to-cyan-600/20',
    Outdoor: 'from-green-500/20 to-emerald-600/20',
    Home: 'from-purple-500/20 to-violet-600/20',
    Wellness: 'from-teal-500/20 to-cyan-600/20',
    Fashion: 'from-pink-500/20 to-rose-600/20',
    Office: 'from-slate-500/20 to-gray-600/20',
    Travel: 'from-sky-500/20 to-blue-600/20',
    Toys: 'from-yellow-500/20 to-orange-600/20',
    Pets: 'from-amber-500/20 to-yellow-600/20',
    Garden: 'from-lime-500/20 to-green-600/20',
    Music: 'from-indigo-500/20 to-purple-600/20',
    Sports: 'from-red-500/20 to-orange-600/20',
    Art: 'from-fuchsia-500/20 to-pink-600/20',
    Science: 'from-violet-500/20 to-indigo-600/20',
    Bathroom: 'from-cyan-500/20 to-teal-600/20',
    Automotive: 'from-zinc-500/20 to-slate-600/20',
    Gaming: 'from-emerald-500/20 to-green-600/20',
    Photography: 'from-amber-500/20 to-orange-600/20',
    Baby: 'from-pink-400/20 to-rose-500/20',
  };
  const gradient = categoryGradients[category] || 'from-accent/20 to-purple-600/20';
  const categoryEmojis = {
    Kitchen: '🍳', Tech: '💻', Outdoor: '🏕️', Home: '🏠', Wellness: '🧘',
    Fashion: '👗', Office: '📎', Travel: '✈️', Toys: '🧸', Pets: '🐾',
    Garden: '🌱', Music: '🎵', Sports: '⚽', Art: '🎨', Science: '🔬',
    Bathroom: '🚿', Automotive: '🚗', Gaming: '🎮', Photography: '📷', Baby: '👶',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="rounded-2xl overflow-hidden max-w-lg mx-auto bg-dark-800/80 border border-white/10 backdrop-blur-md shadow-glass"
    >
      {/* Top banner — mimics Amazon "Brand" bar */}
      <div className="bg-accent/10 px-5 py-2 flex items-center gap-2 border-b border-white/5">
        <span className="text-[10px] uppercase tracking-widest text-accent/60 font-medium">
          Write a review for
        </span>
        {category && (
          <span className="ml-auto text-[10px] bg-white/5 text-white/30 px-2 py-0.5 rounded-full">
            {category}
          </span>
        )}
      </div>

      {/* Product Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-48 object-contain bg-white/5 p-4"
          />
        ) : (
          <div className={`w-full h-32 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-4xl opacity-60">{categoryEmojis[category] || '📦'}</span>
          </div>
        )}
      </motion.div>

      {/* Main product info */}
      <div className="p-5 space-y-3">
        {/* Product name */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl md:text-2xl font-display font-bold text-white leading-tight"
        >
          {name}
        </motion.h2>

        {/* Rating row */}
        {rating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 flex-wrap"
          >
            <StarRating rating={rating} />
            <span className="text-xs text-white/40">
              {rating} out of 5
            </span>
            {reviewCount && (
              <span className="text-xs text-accent/60 hover:underline cursor-default">
                {reviewCount.toLocaleString()} ratings
              </span>
            )}
          </motion.div>
        )}

        {/* Price */}
        {price && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-baseline gap-1"
          >
            <span className="text-2xl font-bold text-neon-green">{price}</span>
            <span className="text-xs text-white/25 line-through ml-2">
              ${(parseFloat(price.replace('$', '').replace('/roll', '')) * 1.4).toFixed(2)}
            </span>
            <span className="text-xs text-neon-green/80 ml-1">
              ({Math.floor(Math.random() * 15 + 20)}% off)
            </span>
          </motion.div>
        )}

        {/* Delivery badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 text-[11px] text-white/30"
        >
          <span className="text-accent font-semibold text-xs">✓ PRIME</span>
          <span>FREE delivery tomorrow</span>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-3" />

        {/* Description */}
        {description && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">About this item</h4>
            <p className="text-sm text-white/60 leading-relaxed">
              {description}
            </p>
          </motion.div>
        )}
      </div>

      {/* Hidden word panel (only for the hidden player) */}
      {isHidden && hiddenWord && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
          className="mx-5 mb-5 p-4 rounded-xl bg-accent/10 border border-accent/30 neon-border"
        >
          <p className="text-xs text-accent/70 uppercase tracking-wider mb-1">
            🤫 Your hidden word
          </p>
          <p className="text-xl font-display font-bold neon-text">
            {hiddenWord}
          </p>
          <p className="text-xs text-white/30 mt-2">
            Slip this word naturally into your review
          </p>
        </motion.div>
      )}

      {/* Normal player hint */}
      {!isHidden && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mx-5 mb-5 p-3 rounded-xl bg-white/5 border border-white/5"
        >
          <p className="text-sm text-white/40 text-center">
            🔍 Write your best review. Someone has a hidden word — can you spot them?
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

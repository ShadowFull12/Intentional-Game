/**
 * Intentional - Game Page
 * Main game screen with all phase UI
 */

import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../context/GameContext';
import Timer from '../components/Timer';
import PhaseBanner from '../components/PhaseBanner';
import ProductCard from '../components/ProductCard';
import WritingPanel from '../components/WritingPanel';
import ReviewCard from '../components/ReviewCard';
import VotePanel from '../components/VotePanel';
import ResultsPanel from '../components/ResultsPanel';
import PlayerList from '../components/PlayerList';
import ScoreBoard from '../components/ScoreBoard';

// Phase durations for timer calculation (must match server)
const PHASE_DURATIONS = {
  productReveal: 5000,
  writing: 60000,
  reveal: 8000,
  voting: 30000,
  results: 10000,
  nextRound: 5000,
};

export default function Game() {
  const navigate = useNavigate();

  const roomId = useGameStore((s) => s.roomId);
  const phase = useGameStore((s) => s.phase);
  const round = useGameStore((s) => s.round);
  const maxRounds = useGameStore((s) => s.maxRounds);
  const product = useGameStore((s) => s.product);
  const hiddenWord = useGameStore((s) => s.hiddenWord);
  const isHidden = useGameStore((s) => s.isHidden);
  const reviews = useGameStore((s) => s.reviews);
  const players = useGameStore((s) => s.players);
  const playerId = useGameStore((s) => s.playerId);
  const hostId = useGameStore((s) => s.hostId);
  const timerEnd = useGameStore((s) => s.timerEnd);
  const votingResults = useGameStore((s) => s.votingResults);
  const scores = useGameStore((s) => s.scores);
  const isGeneratingProduct = useGameStore((s) => s.isGeneratingProduct);

  // Redirect if no room
  useEffect(() => {
    if (!roomId) {
      navigate('/');
    }
  }, [roomId, navigate]);

  // Return to lobby on waiting phase
  useEffect(() => {
    if (phase === 'waiting' && round === 0) {
      navigate('/lobby');
    }
  }, [phase, round, navigate]);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#06b6d4', '#ec4899', '#10b981'],
    });
  }, []);

  if (!roomId) return null;

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Top Bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-4 md:px-8 py-4"
      >
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-display font-bold">
            <span className="text-white/60">Inten</span>
            <span className="neon-text">tional</span>
          </h1>
          <span className="text-xs text-white/20 hidden sm:inline">Room: {roomId}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-white/30">
            Round {round}/{maxRounds}
          </span>
          {timerEnd && (
            <Timer
              timerEnd={timerEnd}
              totalDuration={PHASE_DURATIONS[phase]}
              compact
            />
          )}
        </div>
      </motion.header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {/* Phase Banner */}
        <div className="mb-8">
          <PhaseBanner phase={phase} />
        </div>

        {/* Phase Content */}
        <AnimatePresence mode="wait">
          {/* ─── Product Reveal ──────────────────── */}
          {phase === 'productReveal' && (
            <motion.div
              key="productReveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-lg"
            >
              <ProductCard
                product={product}
                hiddenWord={hiddenWord}
                isHidden={isHidden}
              />
            </motion.div>
          )}

          {/* ─── Writing Phase ───────────────────── */}
          {phase === 'writing' && (
            <motion.div
              key="writing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-lg space-y-6"
            >
              <ProductCard
                product={product}
                hiddenWord={hiddenWord}
                isHidden={isHidden}
              />
              <WritingPanel />

              {/* Submission progress */}
              <div className="text-center text-xs text-white/30">
                {players.filter(p => p.hasSubmittedReview).length} / {players.length} submitted
              </div>
            </motion.div>
          )}

          {/* ─── Reveal Phase ────────────────────── */}
          {phase === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-lg space-y-4"
            >
              <div className="text-center mb-4">
                <p className="text-sm text-white/40">
                  Product: <span className="text-white/70">{typeof product === 'object' ? product.name : product}</span>
                </p>
              </div>
              {reviews.map((review, i) => (
                <ReviewCard
                  key={i}
                  review={review}
                  index={i}
                />
              ))}
            </motion.div>
          )}

          {/* ─── Voting Phase ────────────────────── */}
          {phase === 'voting' && (
            <motion.div
              key="voting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl space-y-6"
            >
              {/* Show reviews with authors for voting context */}
              <div className="glass rounded-2xl p-4">
                <h4 className="text-xs text-white/30 uppercase tracking-wider mb-3">Reviews</h4>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {reviews.map((review, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-xl text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
                          {review.playerName ? review.playerName.charAt(0).toUpperCase() : '#'}
                        </div>
                        <span className="text-xs font-medium text-white/60">
                          {review.playerName || `Review #${i + 1}`}
                        </span>
                      </div>
                      <p className="text-white/80 leading-relaxed pl-8">
                        "{review.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <VotePanel />
            </motion.div>
          )}

          {/* ─── Results Phase ───────────────────── */}
          {phase === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-lg"
            >
              <ResultsPanel
                results={votingResults}
                onConfetti={triggerConfetti}
              />
            </motion.div>
          )}

          {/* ─── Next Round ──────────────────────── */}
          {phase === 'nextRound' && (
            <motion.div
              key="nextRound"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="text-4xl mb-4 inline-block"
              >
                🔄
              </motion.div>
              <p className="text-white/50 text-lg font-display">
                Next round starting...
              </p>
              <p className="text-white/30 text-sm mt-2">
                Round {round + 1} of {maxRounds}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Generating Product Overlay ─────────── */}
        <AnimatePresence>
          {isGeneratingProduct && (
            <motion.div
              key="generatingProduct"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="glass rounded-3xl p-8 max-w-sm mx-4 text-center border border-accent/20 shadow-glass"
              >
                {/* Animated loading icon */}
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent border-r-accent/50"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    className="absolute inset-2 rounded-full border-2 border-transparent border-b-neon-green border-l-neon-green/50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">
                    🛍️
                  </div>
                </div>

                <h3 className="text-lg font-display font-bold text-white mb-2">
                  Generating Product
                </h3>
                <p className="text-sm text-white/40">
                  AI is crafting your next product...
                </p>

                {/* Animated dots */}
                <div className="flex justify-center gap-1 mt-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                      className="w-2 h-2 rounded-full bg-accent"
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom player strip */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-4 md:px-8 py-3 border-t border-white/5"
      >
        <PlayerList
          players={players}
          hostId={hostId}
          currentPlayerId={playerId}
          compact
        />
      </motion.footer>
    </div>
  );
}

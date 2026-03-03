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
                  Product: <span className="text-white/70">{product}</span>
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
              {/* Show reviews for reference */}
              <div className="glass rounded-2xl p-4">
                <h4 className="text-xs text-white/30 uppercase tracking-wider mb-3">Reviews</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {reviews.map((review, i) => (
                    <div key={i} className="p-2 bg-white/5 rounded-xl text-sm text-white/70">
                      <span className="text-accent text-xs mr-2">#{i + 1}</span>
                      "{review.text}"
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

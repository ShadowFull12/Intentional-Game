/**
 * Intentional - Results Page
 * Final game results / end-of-game scoreboard
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../context/GameContext';
import ScoreBoard from '../components/ScoreBoard';

export default function Results() {
  const navigate = useNavigate();
  const roomId = useGameStore((s) => s.roomId);
  const scores = useGameStore((s) => s.scores);
  const players = useGameStore((s) => s.players);
  const disconnect = useGameStore((s) => s.disconnect);

  // Use scores if available, otherwise build from players
  const finalScores = scores.length > 0
    ? scores
    : players.map(p => ({ id: p.id, name: p.name, score: p.score }));

  const sorted = [...finalScores].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  useEffect(() => {
    if (!roomId && finalScores.length === 0) {
      navigate('/');
    }
  }, [roomId, finalScores, navigate]);

  useEffect(() => {
    // Winner confetti
    const timer = setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#8b5cf6', '#06b6d4', '#ec4899', '#10b981', '#f59e0b'],
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayAgain = () => {
    navigate('/lobby');
  };

  const handleLeave = () => {
    disconnect();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      {/* Winner announcement */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="text-6xl mb-4"
        >
          🏆
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
          Game Over!
        </h1>
        {winner && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-white/60"
          >
            <span className="neon-text font-bold">{winner.name}</span> wins with{' '}
            <span className="text-accent">{winner.score}</span> points!
          </motion.p>
        )}
      </motion.div>

      {/* Final Scoreboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-md mb-8"
      >
        <ScoreBoard scores={finalScores} />
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayAgain}
          className="btn-primary px-8 py-3"
        >
          Play Again
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLeave}
          className="btn-secondary px-8 py-3"
        >
          Leave
        </motion.button>
      </motion.div>
    </div>
  );
}

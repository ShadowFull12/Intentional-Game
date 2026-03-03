/**
 * Intentional - Timer Component
 * Animated countdown timer with circular progress ring
 */

import { motion } from 'framer-motion';
import { useTimer } from '../hooks/useTimer';

export default function Timer({ timerEnd, totalDuration, label, compact = false }) {
  const { timeLeft, isExpired } = useTimer(timerEnd, totalDuration);

  const radius = compact ? 28 : 44;
  const circumference = 2 * Math.PI * radius;
  const total = totalDuration ? totalDuration / 1000 : 60;
  const strokeDashoffset = circumference * (1 - Math.max(0, timeLeft / total));

  const isUrgent = timeLeft <= 10 && timeLeft > 0;
  const size = compact ? 72 : 110;
  const textSize = compact ? 'text-lg' : 'text-3xl';

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: Infinity, duration: 0.5 }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={compact ? 3 : 4}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={isUrgent ? '#ef4444' : isExpired ? '#333' : '#8b5cf6'}
            strokeWidth={compact ? 3 : 4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-200"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${textSize} font-bold font-display ${isUrgent ? 'text-red-400' : 'text-white'}`}>
            {timeLeft}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs text-white/40 uppercase tracking-wider font-medium">
          {label}
        </span>
      )}
    </motion.div>
  );
}

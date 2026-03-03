/**
 * Intentional - Timer Hook
 * Countdown timer that syncs with server timerEnd
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * @param {number|null} timerEnd - Unix timestamp when the timer ends
 * @returns {{ timeLeft: number, progress: number, isExpired: boolean }}
 */
export function useTimer(timerEnd, totalDuration = null) {
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef(null);

  const calculateTimeLeft = useCallback(() => {
    if (!timerEnd) return 0;
    const remaining = Math.max(0, timerEnd - Date.now());
    return Math.ceil(remaining / 1000);
  }, [timerEnd]);

  useEffect(() => {
    if (!timerEnd) {
      setTimeLeft(0);
      return;
    }

    // Immediately set current time
    setTimeLeft(calculateTimeLeft());

    // Update every 100ms for smooth countdown
    intervalRef.current = setInterval(() => {
      const left = calculateTimeLeft();
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(intervalRef.current);
      }
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerEnd, calculateTimeLeft]);

  // Calculate progress (0 to 1)
  const total = totalDuration ? totalDuration / 1000 : (timerEnd ? Math.max(1, (timerEnd - Date.now() + timeLeft * 1000) / 1000) : 1);
  const progress = total > 0 ? Math.max(0, Math.min(1, timeLeft / total)) : 0;

  return {
    timeLeft,
    progress,
    isExpired: timeLeft <= 0 && timerEnd !== null,
  };
}

/**
 * Intentional - Auth Hook
 * Convenience hook for auth/connection state
 */

import { useGameStore } from '../context/GameContext';

export function useSocket() {
  const connected = useGameStore((s) => s.connected);
  const playerId = useGameStore((s) => s.playerId);
  return { socket: null, connected, playerId };
}

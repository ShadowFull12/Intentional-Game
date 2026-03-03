/**
 * Intentional - Socket Hook
 * Convenience hook for socket access
 */

import { useGameStore } from '../context/GameContext';

export function useSocket() {
  const socket = useGameStore((s) => s.socket);
  const connected = useGameStore((s) => s.connected);
  return { socket, connected };
}

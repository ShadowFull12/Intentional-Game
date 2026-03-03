/**
 * Intentional - PlayerList Component
 * Shows connected players in the lobby/game
 */

import { motion, AnimatePresence } from 'framer-motion';

export default function PlayerList({ players, hostId, currentPlayerId, compact = false }) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {players.map((p) => (
          <div
            key={p.id}
            className={`
              px-3 py-1.5 rounded-full text-xs font-medium
              ${p.id === currentPlayerId ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-white/5 text-white/60 border border-white/5'}
              ${!p.isConnected ? 'opacity-40' : ''}
            `}
          >
            {p.name}
            {p.id === hostId && ' ★'}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {players.map((player, i) => (
          <motion.div
            key={player.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: i * 0.05 }}
            className={`
              flex items-center justify-between p-3 rounded-xl transition-all
              ${player.id === currentPlayerId ? 'bg-accent/10 border border-accent/20' : 'bg-white/5 border border-transparent'}
              ${!player.isConnected ? 'opacity-40' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${player.id === currentPlayerId ? 'bg-accent/30 text-accent' : 'bg-white/10 text-white/60'}
              `}>
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="font-medium text-white/90">{player.name}</span>
                {player.id === hostId && (
                  <span className="ml-2 text-xs text-accent">Host</span>
                )}
                {player.id === currentPlayerId && (
                  <span className="ml-2 text-xs text-white/30">You</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {player.hasSubmittedReview && (
                <span className="text-xs text-neon-green">✓ wrote</span>
              )}
              {player.hasVoted && (
                <span className="text-xs text-neon-blue">✓ voted</span>
              )}
              <div className={`w-2 h-2 rounded-full ${player.isConnected ? 'bg-neon-green' : 'bg-white/20'}`} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

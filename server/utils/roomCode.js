/**
 * Intentional - Room code generator
 */

/**
 * Generate a random 4-letter room code
 * @param {Set<string>} existing - Set of existing room codes to avoid collision
 * @returns {string} A unique 4-letter uppercase room code
 */
function generateRoomCode(existing = new Set()) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed I and O to avoid confusion
  let code;
  let attempts = 0;
  do {
    code = '';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    attempts++;
    if (attempts > 1000) throw new Error('Could not generate unique room code');
  } while (existing.has(code));
  return code;
}

module.exports = { generateRoomCode };

/**
 * Intentional - Validation utilities
 * Server-side input validation for all socket events
 */

const MAX_NAME_LENGTH = 20;
const MIN_NAME_LENGTH = 2;
const MAX_REVIEW_LENGTH = 200;
const ROOM_CODE_REGEX = /^[A-Z]{4}$/;

/**
 * Sanitize a string by trimming and removing dangerous characters
 */
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/<[^>]*>/g, '').substring(0, 500);
}

/**
 * Validate a player nickname
 */
function validateNickname(name) {
  const clean = sanitize(name);
  if (clean.length < MIN_NAME_LENGTH) return { valid: false, error: 'Name must be at least 2 characters' };
  if (clean.length > MAX_NAME_LENGTH) return { valid: false, error: 'Name must be at most 20 characters' };
  return { valid: true, value: clean };
}

/**
 * Validate a room code
 */
function validateRoomCode(code) {
  if (typeof code !== 'string') return { valid: false, error: 'Invalid room code' };
  const upper = code.toUpperCase().trim();
  if (!ROOM_CODE_REGEX.test(upper)) return { valid: false, error: 'Room code must be 4 letters' };
  return { valid: true, value: upper };
}

/**
 * Validate a review submission
 */
function validateReview(text) {
  const clean = sanitize(text);
  if (clean.length === 0) return { valid: false, error: 'Review cannot be empty' };
  if (clean.length > MAX_REVIEW_LENGTH) return { valid: false, error: `Review must be under ${MAX_REVIEW_LENGTH} characters` };
  return { valid: true, value: clean };
}

/**
 * Validate a vote target
 */
function validateVote(voterId, targetId, players) {
  if (!voterId || !targetId) return { valid: false, error: 'Invalid vote' };
  if (voterId === targetId) return { valid: false, error: 'Cannot vote for yourself' };
  const targetExists = players.some(p => p.id === targetId);
  if (!targetExists) return { valid: false, error: 'Invalid vote target' };
  return { valid: true };
}

module.exports = {
  sanitize,
  validateNickname,
  validateRoomCode,
  validateReview,
  validateVote,
  MAX_REVIEW_LENGTH,
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH,
};

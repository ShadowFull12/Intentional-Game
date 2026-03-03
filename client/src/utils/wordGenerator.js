/**
 * Intentional - Word generator (client-side reference)
 */

export const HIDDEN_WORDS = [
  "banana", "triangle", "velvet", "glacier", "spark", "tunnel",
];

// Words are served by the server, this is just for reference
export function getRandomWord() {
  return HIDDEN_WORDS[Math.floor(Math.random() * HIDDEN_WORDS.length)];
}

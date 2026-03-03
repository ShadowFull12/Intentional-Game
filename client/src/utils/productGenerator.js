/**
 * Intentional - Product name generator (client-side copy for display)
 */

export const PRODUCTS = [
  "Smart Pillow", "Gravity Shoes", "AI Toothbrush", "Invisible Umbrella",
  "Pocket Weather Machine", "Self-Stirring Mug", "Bluetooth Candle",
];

// Products are served by the server, this is just for reference
export function getRandomProduct() {
  return PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
}

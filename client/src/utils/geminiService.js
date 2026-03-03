/**
 * Intentional - Gemini AI Service
 * Generates realistic product details and images using Google Gemini API.
 * Includes retry logic, timeouts, and graceful fallbacks.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDMQhWr9zwGdZGPTQhQTOwolOg28w0P1Lw';
const genAI = new GoogleGenerativeAI(API_KEY);

/* ─── Text Model (product details) ──────────────────── */
const textModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    temperature: 1.0,
    maxOutputTokens: 1024,
  },
});

/* ─── Image Model (product photo) ───────────────────── */
let imageModel;
try {
  imageModel = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-preview-image-generation',
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
      temperature: 0.8,
    },
  });
} catch {
  imageModel = null;
}

/* ─── Helpers ───────────────────────────────────────── */

/** Run a promise with a timeout */
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    ),
  ]);
}

/** Retry a function up to `n` times with exponential backoff */
async function retry(fn, maxRetries = 2, baseDelay = 1000) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries) throw err;
      const delay = baseDelay * Math.pow(2, i) + Math.random() * 500;
      console.warn(`[Gemini] Retry ${i + 1}/${maxRetries} after ${Math.round(delay)}ms:`, err.message);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

/* ─── Product Text Generation ───────────────────────── */

const PRODUCT_PROMPT = `You are a creative product designer for an online store like Amazon.
Generate ONE realistic consumer product that people actually buy on Amazon.

Rules:
- The product must be a real type of item (kitchen gadget, tech accessory, home decor, pet supply, etc.)
- Give it a catchy but REALISTIC brand-style name (e.g. "ThermoGrip Stainless Steel Travel Mug", "PawPerfect Self-Cleaning Slicker Brush")
- Do NOT use sci-fi or fantasy names (no "Quantum", "Plasma", "AI-Powered", "Holographic", etc.)
- Description should be 2-3 sentences, Amazon listing style, highlighting key features and benefits
- Price should be realistic USD
- Rating between 3.5 and 4.9
- Reviews count between 200 and 15000
- Hidden words: exactly 15 common single English words (nouns/adjectives) related to the product's category. These should be everyday words, NOT the product name.
- Category must be one of: Kitchen, Tech, Outdoor, Home, Wellness, Fashion, Office, Travel, Toys, Pets, Garden, Music, Sports, Art, Science, Bathroom, Automotive, Gaming, Photography, Baby

IMPORTANT: Do NOT repeat these previously used products: {usedNames}

Return valid JSON with this exact structure:
{
  "name": "Product Name Here",
  "category": "Category",
  "description": "Amazon-style product description...",
  "price": "$XX.XX",
  "rating": 4.5,
  "reviews": 3200,
  "words": ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8", "word9", "word10", "word11", "word12", "word13", "word14", "word15"]
}`;

/**
 * Generate a product's text details via Gemini.
 * @param {string[]} usedNames - Previously used product names to avoid repeats
 * @returns {Promise<object|null>} Product object or null on failure
 */
export async function generateProductText(usedNames = []) {
  try {
    const prompt = PRODUCT_PROMPT.replace(
      '{usedNames}',
      usedNames.length > 0 ? usedNames.join(', ') : 'none'
    );

    const result = await retry(
      () => withTimeout(textModel.generateContent(prompt), 12000),
      2
    );

    const text = result.response.text();
    const product = JSON.parse(text);

    // Validate required fields
    if (!product.name || !product.category || !product.description || !product.words) {
      console.warn('[Gemini] Invalid product structure:', product);
      return null;
    }

    // Ensure words is an array of at least 10 items
    if (!Array.isArray(product.words) || product.words.length < 10) {
      console.warn('[Gemini] Not enough words:', product.words);
      return null;
    }

    // Sanitize
    return {
      name: String(product.name).substring(0, 80),
      category: String(product.category),
      description: String(product.description).substring(0, 300),
      price: String(product.price).startsWith('$') ? product.price : `$${product.price}`,
      rating: Math.min(5, Math.max(1, Number(product.rating) || 4.2)),
      reviews: Math.max(50, Number(product.reviews) || 1000),
      words: product.words.map((w) => String(w).toLowerCase().trim()).slice(0, 15),
    };
  } catch (err) {
    console.error('[Gemini] Product text generation failed:', err.message);
    return null;
  }
}

/* ─── Product Image Generation ──────────────────────── */

/**
 * Generate a product image via Gemini image generation.
 * Returns a base64 data URL or null.
 * @param {string} productName
 * @param {string} category
 * @returns {Promise<string|null>}
 */
export async function generateProductImage(productName, category) {
  if (!imageModel) return null;

  try {
    const prompt = `Generate a clean, professional product photo of "${productName}" (${category} category) on a plain white background. The image should look like an Amazon product listing photo. Simple, well-lit, centered, no text overlay.`;

    const result = await withTimeout(
      imageModel.generateContent(prompt),
      15000
    );

    // Extract image from response
    const parts = result.response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        const { mimeType, data } = part.inlineData;
        return `data:${mimeType};base64,${data}`;
      }
    }
    return null;
  } catch (err) {
    console.warn('[Gemini] Image generation failed:', err.message);
    return null;
  }
}

/**
 * Generate both product text and image in parallel.
 * @param {string[]} usedNames
 * @returns {Promise<object|null>}
 */
export async function generateFullProduct(usedNames = []) {
  const product = await generateProductText(usedNames);
  if (!product) return null;

  // Try image generation in parallel but don't block on it
  try {
    const image = await withTimeout(
      generateProductImage(product.name, product.category),
      10000
    );
    product.imageUrl = image;
  } catch {
    product.imageUrl = null;
  }

  return product;
}

/**
 * Quick health check — does the API key work?
 * @returns {Promise<boolean>}
 */
export async function checkApiHealth() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await withTimeout(
      model.generateContent('Say "ok" in one word'),
      8000
    );
    const text = result.response.text();
    return text.toLowerCase().includes('ok');
  } catch (err) {
    console.warn('[Gemini] Health check failed:', err.message);
    return false;
  }
}

/**
 * Intentional - Sound effects utility
 * Simple audio manager using Web Audio API
 * Generates procedural sounds (no external audio files needed)
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * Play a short beep/tone
 */
function playTone(frequency = 440, duration = 0.15, volume = 0.15, type = 'sine') {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    // Silently fail if audio is not available
  }
}

// ─── Predefined Sounds ───────────────────────────────

export function playJoin() {
  playTone(523, 0.1, 0.1); // C5
  setTimeout(() => playTone(659, 0.1, 0.1), 80); // E5
}

export function playPhaseChange() {
  playTone(440, 0.08, 0.12);
  setTimeout(() => playTone(554, 0.08, 0.12), 60);
  setTimeout(() => playTone(659, 0.12, 0.12), 120);
}

export function playSubmit() {
  playTone(880, 0.1, 0.08, 'triangle');
}

export function playVote() {
  playTone(330, 0.15, 0.1, 'square');
}

export function playTimerWarning() {
  playTone(800, 0.05, 0.15);
}

export function playTimerExpired() {
  playTone(200, 0.3, 0.12, 'sawtooth');
}

export function playSuccess() {
  playTone(523, 0.1, 0.12);
  setTimeout(() => playTone(659, 0.1, 0.12), 100);
  setTimeout(() => playTone(784, 0.15, 0.12), 200);
}

export function playReveal() {
  playTone(330, 0.15, 0.1, 'triangle');
  setTimeout(() => playTone(440, 0.15, 0.1, 'triangle'), 150);
}

export function playWin() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 0.1), i * 120);
  });
}

export function playLose() {
  playTone(330, 0.2, 0.1, 'sawtooth');
  setTimeout(() => playTone(262, 0.3, 0.1, 'sawtooth'), 200);
}

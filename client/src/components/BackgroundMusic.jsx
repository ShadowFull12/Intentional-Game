import { useState, useRef, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'bg-music-volume';
const DEFAULT_VOLUME = 0.08; // very low background volume

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const startedRef = useRef(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? parseFloat(saved) : DEFAULT_VOLUME;
  });
  const [showSlider, setShowSlider] = useState(false);

  // Sync volume to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
    localStorage.setItem(STORAGE_KEY, volume);
  }, [volume, muted]);

  // Auto-play: try immediately, retry aggressively, and on any interaction
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = () => {
      if (startedRef.current) return;
      audio.volume = volume;
      const p = audio.play();
      if (p) {
        p.then(() => {
          startedRef.current = true;
          cleanup();
          clearInterval(retryId);
        }).catch(() => {});
      }
    };

    // Retry every 500ms — catches when the browser tab gains focus / media-engagement
    const retryId = setInterval(tryPlay, 500);

    // Also fire on any user interaction (capture phase = catches everything)
    const events = ['click', 'keydown', 'touchstart', 'pointerdown', 'mousedown', 'scroll'];
    const cleanup = () => {
      events.forEach(e => document.removeEventListener(e, tryPlay, true));
    };

    tryPlay(); // try immediately

    events.forEach(e => document.addEventListener(e, tryPlay, { capture: true }));

    return () => { cleanup(); clearInterval(retryId); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMute = useCallback(() => setMuted(m => !m), []);

  const changeVolume = useCallback((delta) => {
    setVolume(v => Math.min(1, Math.max(0, +(v + delta).toFixed(2))));
    setMuted(false);
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src="/Velvet Schemes.mp3"
        loop
        preload="auto"
      />

      {/* Floating control panel – bottom-right */}
      <div
        className="fixed bottom-4 right-4 z-50 flex items-center gap-1"
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      >
        {/* Volume down */}
        <button
          onClick={() => changeVolume(-0.05)}
          className={`transition-all duration-200 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white backdrop-blur-md border border-white/10 ${showSlider ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}
          title="Volume Down"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5 6 9H2v6h4l5 4V5Z"/>
          </svg>
        </button>

        {/* Volume slider */}
        <div className={`transition-all duration-200 ${showSlider ? 'w-24 opacity-100' : 'w-0 opacity-0'} overflow-hidden`}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={e => {
              setVolume(parseFloat(e.target.value));
              setMuted(false);
            }}
            className="w-full h-1 accent-violet-500 cursor-pointer"
          />
        </div>

        {/* Volume up */}
        <button
          onClick={() => changeVolume(0.05)}
          className={`transition-all duration-200 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white backdrop-blur-md border border-white/10 ${showSlider ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}
          title="Volume Up"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5 6 9H2v6h4l5 4V5Z"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
        </button>

        {/* Mute / Unmute toggle */}
        <button
          onClick={toggleMute}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white backdrop-blur-md border border-white/10 transition-all duration-200"
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5Z"/>
              <line x1="22" y1="9" x2="16" y2="15"/>
              <line x1="16" y1="9" x2="22" y2="15"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5Z"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          )}
        </button>
      </div>
    </>
  );
}

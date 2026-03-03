# 🎭 Intentional Reviews

A real-time multiplayer social deduction game where players write fake product reviews and try to spot the player hiding a secret word.

🔗 **Play now:** [https://intentional-game.vercel.app](https://intentional-game.vercel.app)

---

## How It Works

1. **📦 A product appears** — Each round, a random product is shown to all players
2. **🤫 One player gets a hidden word** — A secret word related to the product is assigned to one player
3. **✍️ Everyone writes a review** — All players write a fake product review (the hidden player must slip their word in)
4. **🗳️ Vote** — Read the reviews and vote on who you think had the hidden word
5. **🏆 Score points** — Correct voters earn +2 points; the hidden player earns +3 if they survive undetected

## Features

- **Real-time multiplayer** — 3–10 players per room with instant sync
- **Room codes** — Create a room and share a 4-letter code with friends
- **Dynamic products** — Powered by Gemini for unique products each round with automatic fallback catalog
- **Pre-generation** — Next round's product is prepared in the background while you play
- **Animated UI** — Smooth transitions, confetti, and a detective-style flashlight animation
- **Mobile-friendly** — Fully responsive design
- **No accounts needed** — Anonymous authentication gets you playing in seconds

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, TailwindCSS 3 |
| Animations | Framer Motion 11 |
| State | Zustand 4 |
| Backend/Sync | Firebase Realtime Database |
| Auth | Firebase Anonymous Auth |
| Products | Google Gemini API (with static fallback) |
| Hosting | Vercel |

## Project Structure

```
client/
├── src/
│   ├── components/     # Reusable UI (ProductCard, Timer, VotePanel, etc.)
│   ├── context/        # GameContext — Zustand store + Firebase game controller
│   ├── pages/          # Home, Lobby, Game screens
│   └── utils/          # Firebase config, Gemini service, product generator, sounds
├── public/             # Static assets
└── package.json
database.rules.json     # Firebase RTDB security rules
vercel.json             # Vercel deployment config
```

## Getting Started (Local Development)

```bash
# Clone the repo
git clone https://github.com/ShadowFull12/Intentional-Game.git
cd Intentional-Game

# Install dependencies
cd client
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Game Rules

- **Minimum 3 players** to start a game
- **Maximum 10 players** per room
- **10 rounds** per game
- Reviews are limited to **200 characters**
- You **cannot vote for yourself**
- The host's browser acts as the game controller — keep it open!

## Scoring

| Action | Points |
|--------|--------|
| Correctly identify the hidden player | +2 |
| Survive undetected as the hidden player | +3 |

## License

MIT

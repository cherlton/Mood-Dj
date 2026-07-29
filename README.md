<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=9B59B6,FF6B00&height=200&section=header&text=🎵%20Mood%20DJ&fontSize=55&fontColor=ffffff&fontAlignY=38&desc=AI-Powered%20Music%20Mood%20Selector&descAlignY=58&descSize=20" width="100%"/>

<br/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&pause=1000&color=A855F7&center=true&vCenter=true&width=600&lines=Tell+me+how+you+feel...+🎶;AI+detects+your+mood+in+seconds;The+right+playlist+for+every+emotion)](https://git.io/typing-svg)

<br/>

[![Demo](https://img.shields.io/badge/🎵_View_Demo-LinkedIn-0077B5?style=for-the-badge)](https://www.linkedin.com/feed/update/urn:li:activity:7360247363614969856/)
[![GitHub](https://img.shields.io/badge/Source-GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/cherlton/Mood-Dj)

</div>

---

## 🤔 What is Mood DJ?

**Mood DJ** is a full-stack web app that recommends music based on how you're feeling. You can either type out how your day is going or record a voice note, and the app will figure out your mood and serve you a playlist to match.

### How It Works

When a user records a voice note or types in how they feel, the app kicks off a three-step chain on the backend. First, **AssemblyAI** takes the raw audio and transcribes it into plain text — it handles the speech-to-text part. That transcribed text (or text the user typed directly) then gets passed to **OpenAI** (`gpt-4o-mini`), which acts as a mood classifier — it reads the text and returns a single mood word like "happy", "sad", or "anxious" from a fixed list. Finally, that mood word is used as a search query against the **Spotify** API, which finds playlists matching that mood and pulls back a list of track URIs. The frontend then uses those URIs to serve up music that matches how the user is feeling. Each service does exactly one job — AssemblyAI turns voice into text, OpenAI turns text into a mood label, and Spotify turns that mood label into music — and they're chained together like a conveyor belt, where the output of one becomes the input of the next.

---

## 🌟 Features

| Feature | Description |
|---|---|
| 🎤 **Voice Input** | Record a voice note describing how you feel |
| ⌨️ **Text Input** | Type your mood directly if you prefer |
| 🧠 **AI Mood Detection** | OpenAI classifies your emotional state from natural language |
| 🗣️ **Speech-to-Text** | AssemblyAI transcribes voice recordings into text |
| 🎶 **Dynamic Playlists** | Spotify serves up tracks matching your detected mood |
| 🎨 **Animated UI** | Smooth transitions and interactive visualisations |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |

---

## 🛠️ Built With

<div align="center">

**Frontend**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Backend**

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)

**APIs**

![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Spotify](https://img.shields.io/badge/Spotify-1DB954?style=for-the-badge&logo=spotify&logoColor=white)
![AssemblyAI](https://img.shields.io/badge/AssemblyAI-0000FF?style=for-the-badge&logoColor=white)

</div>

---

## 📁 Project Structure

```
Mood-Dj/
├── src/                          # React frontend (Vite)
│   ├── components/               # Reusable UI components
│   ├── pages/                    # HomePage, PlaylistPage
│   ├── services/
│   │   ├── apiClient.js          # Centralized fetch wrapper
│   │   └── moodService.js        # Calls backend endpoints
│   ├── config/                   # Frontend config (API base URL)
│   └── App.jsx                   # Root component & routing
│
├── Mood-Dj-Backend/              # Flask backend (Python)
│   ├── app.py                    # App factory & entry point
│   ├── config.py                 # Loads env vars
│   ├── controllers/
│   │   ├── mood_controller.py    # /analyze_mood & /get_playlist
│   │   └── voice_controller.py   # /analyze-voice (audio → mood)
│   ├── services/
│   │   ├── assemblyai_service.py # Speech-to-text via AssemblyAI
│   │   ├── openai_service.py     # Mood classification via OpenAI
│   │   └── spotify_service.py    # Playlist fetching via Spotify
│   ├── exceptions/               # Custom error classes
│   └── requirements.txt          # Python dependencies
│
├── .env.example                  # Example environment variables
└── package.json                  # Frontend dependencies & scripts
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/analyze_mood` | Send `{ "text": "..." }` → returns `{ "mood": "happy" }` |
| `POST` | `/get_playlist` | Send `{ "mood": "happy" }` → returns `{ "tracks": [...] }` |
| `POST` | `/analyze-voice` | Upload audio file → returns `{ "transcription": "...", "mood": "..." }` |
| `GET` | `/health` | Health check for the backend |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **Python** (v3.9+)
- API keys for [OpenAI](https://platform.openai.com/), [AssemblyAI](https://www.assemblyai.com/), and [Spotify](https://developer.spotify.com/)

### 1. Clone the repo

```bash
git clone https://github.com/cherlton/Mood-Dj.git
cd Mood-Dj
```

### 2. Set up environment variables

Create a `.env` file in the **root** directory for the frontend:

```env
VITE_BACKEND_HOST=http://localhost
VITE_BACKEND_PORT=5000
VITE_API_BASE_URL=http://localhost:5000
```

Create a `.env` file in the **`Mood-Dj-Backend/`** directory for the backend:

```env
OPENAI_API_KEY=your_openai_api_key
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### 3. Start the backend

```bash
cd Mood-Dj-Backend
pip install -r requirements.txt
python app.py
```

The backend will start on `http://localhost:5000`.

### 4. Start the frontend

```bash
# From the root directory
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (Vite default).

---

## 🧠 How the AI Pipeline Works

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  AssemblyAI  │──────▶│   OpenAI    │──────▶│   Spotify   │
│              │       │             │       │             │
│  Voice → Text│       │ Text → Mood │       │ Mood → Music│
└─────────────┘       └─────────────┘       └─────────────┘
```

1. **AssemblyAI** — Receives raw audio, uploads it, and polls until transcription is complete
2. **OpenAI** — Takes the transcribed text and classifies it into a single mood word (e.g. `happy`, `sad`, `energetic`)
3. **Spotify** — Searches for playlists matching that mood keyword and returns track URIs

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=9B59B6,FF6B00&height=100&section=footer" width="100%"/>

**Made with ❤️ and AI**

</div>

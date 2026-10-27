# KrishiMitra AI

AI-Powered Agriculture Crop Advisory Assistant — your AI assistant for smarter farming.

## Project Structure

```
krishimitra-ai/
├── client/          # React + TypeScript + Vite + Tailwind CSS frontend
├── server/          # Node.js + Express + TypeScript backend
└── package.json     # Root monorepo scripts
```

## Prerequisites

- Node.js 18+
- npm 9+
- A Google Gemini API key

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   npm run install:all
   ```

2. **Configure environment variables:**

   Create `server/.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.0-flash
   PORT=3001
   CLIENT_URL=http://localhost:5173
   ```

3. **Start development servers:**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## Features

- Multilingual agricultural chatbot (English, Hindi, Telugu)
- Crop advisory, pest & disease guidance, soil management advice
- Optional farming context (crop, location, soil type, etc.)
- Safety-conscious recommendations with disclaimers
- Session-based conversation history
- Responsive, mobile-friendly design

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Lucide React
- **Backend:** Node.js, Express, TypeScript, Zod
- **AI:** Google Gemini API via @google/genai SDK

## License

MIT

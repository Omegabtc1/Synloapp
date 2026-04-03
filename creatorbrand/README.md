# CreatorBrand

Web app for creators and brands: **waitlist** on the landing page, **account signup / login**, and authenticated dashboards. Backend is Express + Prisma (SQLite); frontend is React + Vite.

## What this project is not

- No blockchain, NFT, or wallet SDKs in `package.json`.
- Any `StacksProvider`-style errors in a **browser** come from an **optional wallet extension** that injects scripts globally. They are unrelated to this repo’s dependencies.

## Run locally

From **`creatorbrand/`** (this folder):

```bash
npm install
npm run dev
```

- Opens the **API** on port **5000** and the **Vite** app on **5173**.
- `predev` runs first and frees **5000** and **5173** if a previous dev session left processes behind.
- In **`client/.env`**, keep `VITE_API_URL` and `VITE_SOCKET_URL` **empty** so the UI talks to **`/api`** and **`/socket.io`** through the Vite proxy (same site as the page, cookies work reliably).

Copy env templates from **`.env.example`** into `server/.env` and `client/.env` as needed.

## Signup and waitlist (for debugging)

| Flow | Frontend | API |
|------|----------|-----|
| Waitlist | `client/src/pages/Landing.jsx` → `waitlistStore.join` | `POST /api/waitlist/join`, `GET /api/waitlist/count` |
| Signup | `client/src/pages/Signup.jsx` → `authStore.signup` | `POST /api/auth/signup` |

If waitlist or signup fails, use **browser DevTools → Network** on the failing request. The **server** terminal should show `Server on port 5000` with no crash.

## Deploy on Vercel (frontend)

The repo root has **no** `package.json` (the app lives under `creatorbrand/` only). Configure Vercel in one of these ways:

1. **Recommended — leave Root Directory empty (repository root)**  
   Vercel reads the root **`vercel.json`**, which installs from `creatorbrand/`, runs `npm run build -w client`, and publishes `creatorbrand/client/dist`.

2. **Alternative — Root Directory = `creatorbrand/client`**  
   Use the default Vite install/build; **`creatorbrand/client/vercel.json`** adds SPA fallback so client routes (e.g. `/login`) work on refresh.

**Environment variables (Production):** there is no Vite proxy on Vercel, so set the real API (and socket, if you use it), for example:

- `VITE_API_URL` — base URL of your deployed API (e.g. `https://api.yourdomain.com`), **no** trailing slash  
- `VITE_SOCKET_URL` — same origin as the API if you use Socket.IO (often the same as the API URL)

The Express + SQLite API is **not** deployed by this static build; host the API separately (Railway, Render, Fly, a VPS, etc.) and point these variables at it. Ensure the API allows your Vercel origin in CORS and cookie settings if you use credentials.

## Dev notes

- **`client/vite.config.js`** sets `server.forwardConsole: false` so Vite 8 does not mirror every browser `console.error` into the terminal (use the browser console for frontend logs).

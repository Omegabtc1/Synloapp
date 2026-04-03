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

## Dev notes

- **`client/vite.config.js`** sets `server.forwardConsole: false` so Vite 8 does not mirror every browser `console.error` into the terminal (use the browser console for frontend logs).

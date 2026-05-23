# Deploy Mayur Abrasives (Emergent + Vercel)

This project has two parts:

| Part | Stack | Host |
|------|--------|------|
| **Frontend** | React (CRA + Craco) | **Vercel** |
| **Backend** | FastAPI + MongoDB | **Render** + **MongoDB Atlas** |

Vercel is ideal for the React site. The API needs a long-running Python server and MongoDB, so it is deployed on Render (free tier) with Atlas for the database.

---

## Prerequisites

1. [GitHub](https://github.com) account — push this repo to GitHub  
2. [Vercel](https://vercel.com) account  
3. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free M0 cluster)  
4. [Render](https://render.com) account (free web service)  

---

## Step 1 — MongoDB Atlas (database)

1. Create a cluster (M0 free).  
2. **Database Access** → add a user with password.  
3. **Network Access** → **Allow access from anywhere** (`0.0.0.0/0`) for Render (or add Render’s IPs later).  
4. **Connect** → **Drivers** → copy the connection string, e.g.  
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`  
5. Set the database name in the connection string or via env: `DB_NAME=mayur_abrasives`  
   - You can append: `...mongodb.net/mayur_abrasives?retryWrites=true&w=majority`  
   - Use this full string as `MONGO_URL` on Render.

---

## Step 2 — Deploy backend on Render

1. Push code to GitHub.  
2. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint** (or **Web Service**).  
3. Connect the repo. If using **Blueprint**, Render reads `render.yaml` at the repo root.  
4. Set **Root Directory** to `backend` if you create the service manually.  
5. **Environment variables** (required):

   | Variable | Example |
   |----------|---------|
   | `MONGO_URL` | `mongodb+srv://...` from Atlas |
   | `DB_NAME` | `mayur_abrasives` |
   | `JWT_SECRET` | long random string (32+ chars) |
   | `ADMIN_EMAIL` | `admin@mayur.com` |
   | `ADMIN_PASSWORD` | strong password |
   | `FRONTEND_URL` | `https://your-app.vercel.app` (set after Step 3) |

6. **Build command:** `pip install -r requirements-prod.txt`  
7. **Start command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`  
8. Deploy and open `https://YOUR-SERVICE.onrender.com/api/health` — should return `{"status":"healthy",...}`.

**Note:** Uploaded images on Render’s free tier use local disk and may reset on redeploy. For production, use S3 or similar later.

---

## Step 3 — Deploy frontend on Vercel

### Option A — Root of repo (recommended)

`vercel.json` at the project root is already configured.

1. [vercel.com/new](https://vercel.com/new) → Import your GitHub repo.  
2. **Framework Preset:** Create React App (or Other).  
3. Leave **Root Directory** empty (repo root).  
4. **Environment variables:**

   | Name | Value |
   |------|--------|
   | `REACT_APP_BACKEND_URL` | `https://YOUR-SERVICE.onrender.com` (no trailing slash) |

5. **Build settings** (should auto-detect from `vercel.json`):
   - Install: `cd frontend && npm install --legacy-peer-deps`
   - Build: `cd frontend && npm run build`
   - Output: `frontend/build`

6. Deploy.

### Option B — Frontend folder only

1. Import repo on Vercel.  
2. Set **Root Directory** to `frontend`.  
3. Add env var `REACT_APP_BACKEND_URL` as above.  
4. Deploy (uses `frontend/vercel.json`).

### Node version

Vercel uses **Node 20** via `frontend/.nvmrc` and `package.json` `engines`. Do not use Node 24 — the build can crash.

---

## Step 4 — Link frontend and backend

1. Copy your Vercel URL, e.g. `https://mayur-abrasives.vercel.app`.  
2. In **Render** → your API service → **Environment** → set  
   `FRONTEND_URL=https://mayur-abrasives.vercel.app`  
3. Redeploy Render (or wait for auto-redeploy).  
4. In **Vercel** → **Settings** → **Environment Variables** → confirm  
   `REACT_APP_BACKEND_URL=https://YOUR-SERVICE.onrender.com`  
5. **Redeploy** Vercel so the build picks up the API URL.

---

## Step 5 — Verify

1. Open the Vercel site — homepage, products, contact should load.  
2. Admin: `https://your-site.vercel.app/admin/login`  
   - Email/password from `ADMIN_EMAIL` / `ADMIN_PASSWORD` on Render.  
3. API: `https://YOUR-SERVICE.onrender.com/api/products` should return JSON.

---

## Deploy from CLI (optional)

```bash
npm i -g vercel
cd frontend
vercel
# Follow prompts; set REACT_APP_BACKEND_URL when asked or in the dashboard
vercel --prod
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Vercel build fails on ESLint | `DISABLE_ESLINT_PLUGIN=true` is set in `vercel.json` |
| Vercel build crashes (Node) | Use Node **20** (`.nvmrc`), not 24 |
| Blank page / 404 on refresh | SPA rewrites are in `vercel.json` |
| API errors / CORS | Set `FRONTEND_URL` on Render to your exact Vercel URL |
| `REACT_APP_*` not updating | Redeploy Vercel after changing env vars |
| Render cold start slow | Free tier sleeps after inactivity; first request may take ~30s |
| MongoDB connection failed | Check Atlas IP allowlist and `MONGO_URL` password encoding |

---

## What was added for deployment

- `vercel.json` (root + `frontend/`) — build env, SPA routing  
- `frontend/.nvmrc` — Node 20  
- `frontend/package.json` — `engines`  
- `frontend/.env.example` — `REACT_APP_BACKEND_URL`  
- `backend/.env.example` — all backend secrets  
- `backend/requirements-prod.txt` — production Python deps  
- `render.yaml` — one-click backend on Render  

---

## Admin credentials

After the first API startup, check `memory/test_credentials.md` in the repo (if generated) or use the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set on Render.

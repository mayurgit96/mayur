# Deploy frontend + backend on Railway

Both apps run in **one Railway project** as **two services** from the same GitHub repo.

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────┐
│ Railway         │     │ Railway         │     │ MongoDB      │
│ Frontend        │────▶│ Backend         │────▶│ Atlas        │
│ (React static)  │     │ (FastAPI)       │     │              │
└─────────────────┘     └─────────────────┘     └──────────────┘
```

Database stays on **MongoDB Atlas** (recommended). Railway can host MongoDB too, but Atlas is simpler for this project.

---

## 1. Push code to GitHub

Repo: `https://github.com/mayurplus/Mayur-plus` (or your repo URL).

---

## 2. Create Railway project

1. https://railway.app → sign up with **GitHub**
2. **New Project** → **Deploy from GitHub repo** → select **Mayur-plus**
3. Railway may create one service — you will add a second in step 4.

---

## 3. Service A — Backend (API)

1. Click the service → **Settings**
2. **Root Directory:** `backend`
3. **Start Command** (if not auto from `backend/railway.toml`):
   ```bash
   uvicorn server:app --host 0.0.0.0 --port $PORT
   ```
4. **Variables:**

   | Variable | Value |
   |----------|--------|
   | `MONGO_URL` | `mongodb+srv://mayurplus96_db_user:Mayur%402026@cluster0.nv9fptp.mongodb.net/mayur_abrasives?retryWrites=true&w=majority` |
   | `DB_NAME` | `mayur_abrasives` |
   | `JWT_SECRET` | long random string |
   | `ADMIN_EMAIL` | `admin@mayur.com` |
   | `ADMIN_PASSWORD` | your admin password |
   | `FRONTEND_URL` | *(set after frontend deploy — Railway public URL)* |

5. **Settings → Networking → Generate Domain** → copy URL, e.g.  
   `https://mayur-backend-production.up.railway.app`
6. Test: `https://YOUR-BACKEND-URL/api/health`

---

## 4. Service B — Frontend (website)

1. In the same project: **+ New** → **GitHub Repo** → same repo **Mayur-plus**
2. **Settings → Root Directory:** `frontend`
3. Build/start come from `frontend/railway.toml` (Node 20, `npm run build`, `serve`)
4. **Variables:**

   | Variable | Value |
   |----------|--------|
   | `REACT_APP_BACKEND_URL` | `https://YOUR-BACKEND-URL` (no trailing slash) |

5. **Generate Domain** → e.g. `https://mayur-frontend-production.up.railway.app`

---

## 5. Link frontend ↔ backend

1. Copy **frontend** public URL
2. Backend service → **Variables** → set `FRONTEND_URL` to that URL
3. Redeploy backend (or wait for auto deploy)
4. Redeploy frontend after any `REACT_APP_*` change (build-time variable)

---

## 6. Verify

| URL | Expected |
|-----|----------|
| Frontend domain | Mayur homepage |
| `/admin/login` | Admin login |
| Backend `/api/health` | `{"status":"healthy"}` |
| Backend `/api/products` | JSON product list |

---

## Costs

- Railway gives a monthly **free trial credit**; two small services may fit within it.
- MongoDB Atlas M0 is **free**.
- Watch usage in Railway **Usage** tab.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Frontend build fails | Root = `frontend`; Node 20 via `nixpacks.toml` |
| Blank API / CORS | Set `FRONTEND_URL` on backend to exact Railway frontend URL |
| `REACT_APP_*` not applied | Redeploy frontend after changing variables |
| MongoDB error | Atlas → Network Access → `0.0.0.0/0`; check `MONGO_URL` password encoding (`@` → `%40`) |
| Backend module not found | Root Directory must be `backend`, not repo root |

---

## Vercel?

You do **not** need Vercel if both are on Railway. Use only Railway + Atlas.

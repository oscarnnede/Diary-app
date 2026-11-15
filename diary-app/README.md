# Inkling — A Colorful Diary

A personal diary / mood journal.

- `backend/` — FastAPI, Postgres-only (no SQLite fallback — `DATABASE_URL` is required).
- `frontend/` — React + Vite + Tailwind v4. Timeline view, mood/color tagging, search, mood-mix chart.
- `k8s/` — Kubernetes manifests for a minikube deployment (Postgres + backend + frontend).
- `Jenkinsfile` — builds both images straight into minikube's docker daemon and deploys them.
- `docker-compose.yaml` — the fast path for local testing without touching Kubernetes at all.

---

## Part 1 — Run it locally, no Docker (fastest way to check the app itself)

```bash
# Postgres (however you normally run it locally, or via a one-off container)
docker run -d --name diary-postgres \
  -e POSTGRES_USER=diary -e POSTGRES_PASSWORD=diary -e POSTGRES_DB=diary \
  -p 5432:5432 postgres:16

# backend
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL=postgresql://diary:diary@localhost:5432/diary
uvicorn main:app --reload --port 8000

# frontend (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

---

## Part 2 — Run it with Docker Compose (backend + frontend + Postgres together)

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

If you deploy somewhere the browser can't reach `localhost:8000`, rebuild the frontend with the real reachable URL — Vite bakes `VITE_API_URL` in at *build* time, not runtime:

```bash
docker compose build --build-arg VITE_API_URL=http://your-backend-host:8000 frontend
```

---

## Part 3 — Deploy to minikube manually (do this once before wiring up Jenkins)

This confirms the k8s manifests actually work before you add automation on top.

```bash
minikube start
eval $(minikube docker-env)          # point your shell's docker CLI at minikube's daemon

docker build -t diary-backend:latest ./backend
docker build -t diary-frontend:latest \
  --build-arg VITE_API_URL=http://$(minikube ip):30080 \
  ./frontend

kubectl apply -f k8s/

kubectl get pods                     # wait until everything shows Running
minikube ip                          # note this IP
```

Open `http://<minikube-ip>:30090` in your browser — that's the frontend. The backend is reachable at `http://<minikube-ip>:30080` (and `/docs` for the API docs).

**If you change code and want to redeploy manually** (same images, same tags), a plain `kubectl apply` won't pick up the new image content — you need to also force a restart:

```bash
docker build -t diary-backend:latest ./backend   # rebuild into minikube's daemon
kubectl rollout restart deployment/diary-backend
kubectl rollout status deployment/diary-backend
```

This is exactly what the Jenkins pipeline automates in Part 4.

---

## Part 4 — Automate it with Jenkins + a GitHub webhook

Once Part 3 works manually, wire up the automation:

1. **Expose Jenkins to the internet** — `ngrok http 8080` (or whatever port Jenkins runs on). Copy the public URL.
2. **Confirm the GitHub plugin is installed** in Jenkins (Manage Jenkins → Plugins).
3. **Create a Jenkins pipeline job** pointing at this repo, using the `Jenkinsfile` in the root. Under Build Triggers, check "GitHub hook trigger for GITScm polling".
4. **Add a webhook in GitHub** — repo Settings → Webhooks → Add webhook. Payload URL: `https://YOUR_NGROK_URL/github-webhook/` (trailing slash matters). Content type: `application/json`.
5. **Check GitHub's "Recent Deliveries" tab** on the webhook page — should show a green checkmark for the automatic test ping.
6. **Push a commit.** Jenkins should start a build automatically within a few seconds, run the `Jenkinsfile`, and redeploy to minikube.

Note: ngrok's free tier gives you a new URL every restart — you'll need to update the GitHub webhook's Payload URL each time you restart the tunnel, unless you're on a paid plan with a static domain.

**Jenkins itself needs to run somewhere that can also reach your minikube cluster** — in practice this usually means Jenkins running on the same machine as minikube (as an agent, or directly), since minikube's docker daemon and `kubectl` context are local to that machine.

---

## What's been tested so far

- Backend: full CRUD, search, mood filtering, mood-stats endpoint, and input validation — verified live against a real PostgreSQL 16 instance (not SQLite standing in for it).
- CORS + create flow — verified with a simulated browser request from the Vite dev origin.
- Frontend: builds clean with `npm run build`; all 8 mood/accent colors' dynamic Tailwind classes confirmed present in the compiled CSS (an earlier version of this had a real bug here — only 1 of 8 colors' focus rings worked before the fix).
- `k8s/*.yaml` — all four manifests parse as valid YAML with the expected resource kinds. **Not** validated against a live Kubernetes API server (no cluster available in the environment these were built in) — run `kubectl apply --dry-run=client -f k8s/` yourself before trusting this fully.
- Docker builds, Jenkins pipeline, and the GitHub webhook chain — **none of this has been run end-to-end**, since Docker, Jenkins, and a real GitHub repo aren't available in the environment this was built in. Verify Part 3 and Part 4 yourself, in that order.

## Known simplifications

- No auth — single-user, local/practice use.
- `k8s/02-backend.yaml` hardcodes the Postgres connection string rather than composing it from the Secret — fine for practice, worth fixing (e.g. with an init container or `envFrom` + a small entrypoint script) if this ever needs to look production-representative.
- Both app images always use the `:latest` tag rather than a unique tag per build — simpler for a single-developer minikube workflow, but means the Jenkinsfile has to explicitly force a rollout restart (see Part 3) since Kubernetes can't tell the image changed from the tag alone. A more production-realistic setup would tag by build number/git SHA and use `kubectl set image` instead.

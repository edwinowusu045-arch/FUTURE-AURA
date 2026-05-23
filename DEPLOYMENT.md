# AURA Deployment Guide

## Recommended platform

For this monorepo stack, the best free deployment platform is **Render**.

Why Render?
- Supports monorepos with multiple services in a single `render.yaml`
- Supports Node.js frontend and backend services
- Provides managed PostgreSQL databases
- Offers automatic deploys from GitHub on `main`
- Custom domains are supported on free services (domain registration itself may cost money)

This repo includes a ready-to-use `render.yaml` for the frontend, backend, and a free PostgreSQL database.

---

## Deployment files added

- `render.yaml` — Render service definitions for frontend, backend, and database
- `.github/workflows/ci.yml` — CI workflow updated to install dependencies, build both apps, lint, typecheck, and test
- `DEPLOYMENT.md` — this deployment guide

---

## 1. Prepare the repository for Render

1. Add the new `render.yaml` file to the repository root.
2. Ensure the repo is on the `main` branch.
3. Add local environment defaults in `.env.example`:
   - `DATABASE_PROVIDER=sqlite`
   - `DATABASE_URL=file:./server/dev.db`
   - `JWT_SECRET=supersecretdevkey`
   - `FRONTEND_ORIGIN=http://localhost:3000`

These values support local development and make the repository ready to switch to PostgreSQL in production.

---

## 2. Choose Render and connect the GitHub repository

1. Create a free Render account at https://render.com.
2. Connect Render to your GitHub account and grant access to the `FUTURE-AURA` repository.
3. In the Render dashboard, add the project by importing the repository.
4. Render will detect `render.yaml` and create the two web services and one managed database.

---

## 3. Configure environment variables on Render

### Backend service

Set the following environment variables in the Render dashboard for the backend service:

- `DATABASE_PROVIDER=postgresql`
- `JWT_SECRET=<a strong secret>`
- `FRONTEND_ORIGIN=https://<your-frontend-service>.onrender.com`
- `AI_ENGINE_MODE=mock`
- `OPENAI_API_KEY=` (optional, only if you connect a real OpenAI account)

Render will automatically provide `DATABASE_URL` for the managed `aura-db` database.

### Frontend service

Set the following environment variable on the frontend service:

- `NEXT_PUBLIC_API_BASE_URL=https://<your-backend-service>.onrender.com`

---

## 4. PostgreSQL database on Render

Render creates the managed PostgreSQL database automatically from `render.yaml`.

### How to verify

1. In Render, open the managed database resource `aura-db`.
2. Confirm the database is online and attached to the backend service.
3. If needed, use the Render SQL shell or connect with a database client.

---

## 5. Update the backend Prisma schema for Postgres compatibility

The backend uses SQLite locally and a separate PostgreSQL Prisma schema for Render production.

- Local development uses `server/prisma/schema.prisma`
- Render production uses `server/prisma/schema.postgres.prisma`
- The backend build command regenerates the Prisma client for PostgreSQL during deployment

After deployment, Prisma inside the backend service will connect to the managed Render database.

---

## 6. Verify the deployment process

### On push to `main`

Render will automatically build and deploy both services when `main` is updated.

Also, GitHub Actions will run `npm install`, `npm run lint`, `npm run typecheck`, `npm run test`, and build both the frontend and backend.

### Accessing the live site

Once deployed, visit the Render URL for the frontend service.

To verify:
1. Open the frontend URL.
2. Register or log in.
3. Upload a sample CSV from the Data Room.
4. Run an AI analysis on the uploaded dataset.
5. Confirm the dashboard displays uploaded datasets and AI results.

---

## 7. Optional custom domain

Render supports custom domains on the free tier. The platform does not include a domain name, so domain registration itself may cost money.

If you already own a domain:
1. Add the custom domain to the Render frontend service.
2. Follow Render's DNS instructions to create the required CNAME record.
3. Wait for DNS to propagate.

If you do not own a domain, you can still use the free Render subdomain at no cost.

---

## 8. Troubleshooting

- If the frontend cannot reach the backend, confirm `NEXT_PUBLIC_API_BASE_URL` is set to the backend service URL.
- If authentication fails, confirm `JWT_SECRET` is identical for the backend service and recreate the backend if needed.
- If Prisma cannot connect, verify the backend is using the PostgreSQL Prisma schema via the Render build command and the managed `aura-db` database is attached.

---

## 9. Vercel + Railway alternative

If you prefer to avoid Render, this repo can also deploy with Vercel for the frontend and Railway for the backend.

### Frontend on Vercel

1. Create a new Vercel project from GitHub.
2. Set the root directory to `next-app`.
3. Set the build command to `npm run build`.
4. Set the install command to `npm install`.
5. Add the environment variable:
   - `NEXT_PUBLIC_API_BASE_URL=https://<your-backend-url>`

### Backend on Railway

1. Create a new Railway project from GitHub.
2. Create a new service using the `server` directory or the root repository.
3. If Railway uses the root repository, set the start command to `npm run start --workspace server`.
4. Add PostgreSQL using Railway's managed database plugin.
5. Add these environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET=<strong-secret>`
   - `FRONTEND_ORIGIN=https://<your-vercel-url>`
   - `NODE_ENV=production`
   - `UPLOAD_DIR=/tmp/uploads`

### Notes

- Use the same `JWT_SECRET` value for production as the backend service expects.
- The frontend communicates with the backend through `NEXT_PUBLIC_API_BASE_URL`.
- Railway and Vercel both support GitHub auto-deploy, so pushing to `main` will trigger fresh builds.

## 10. Future improvements

- Add Render health checks and log forwarding
- Add a custom domain for portfolio presentation
- Enable real OpenAI integration with `OPENAI_API_KEY`
- Add production logging and monitoring

# FUTURE AURA

AURA is an enterprise-ready AI business intelligence platform built as a production-grade monorepo.

## Repository structure

- `next-app/` — Next.js 14 frontend with TypeScript, Tailwind CSS, and professional UI shell
- `server/` — Fastify backend with JWT auth, Swagger docs, rate limiting, and Pino logging
- `packages/shared/` — Shared TypeScript types and Zod validation schemas
- `docker-compose.yml` — Local environment with frontend, backend, and Redis
- `DEPLOYMENT.md` — production deployment guide for Render and GitHub auto-deploy
- `Makefile` — Standard developer commands for local development and database setup

## Quick start

1. Install dependencies
   ```bash
   npm install
   ```

2. Copy the example environment file
   ```bash
   cp .env.example .env
   ```

3. Start the full stack
   ```bash
   make dev
   ```

4. Open the app
   - Frontend: `http://localhost:3000`
   - Backend API docs: `http://localhost:4000/api/docs`

## Deploying with Vercel + Railway

This repo is a monorepo with separate `next-app` frontend and `server` backend workspaces. The easiest deployment flow is:

- Frontend: Vercel (project uses `next-app`)
- Backend: Railway (Node.js service using `server`)
- Database: Railway PostgreSQL

### Vercel frontend setup

1. Create a new project in Vercel from your GitHub repository.
2. Set the project root directory to `next-app`.
3. Use the install command: `npm install`.
4. Use the build command: `npm run build`.
5. Add the environment variable:
   - `NEXT_PUBLIC_API_BASE_URL=https://<your-backend-url>`

### Railway backend setup

1. Create a new project in Railway and link the same GitHub repository.
2. Use `server` as the service directory or configure the service from the root and use `npm run start --workspace server`.
3. Add a PostgreSQL plugin and copy the generated `DATABASE_URL`.
4. Add the environment variables:
   - `DATABASE_URL` from Railway Postgres
   - `JWT_SECRET=<strong-secret>`
   - `FRONTEND_ORIGIN=https://<your-vercel-url>`
   - `NODE_ENV=production`
   - `UPLOAD_DIR=/tmp/uploads`

### Why this works

- Vercel builds the Next.js frontend inside `next-app`.
- Railway runs the backend service from `server` and uses the shared workspace package.
- The frontend points to the backend URL using `NEXT_PUBLIC_API_BASE_URL`.

## Development commands

- `make dev` — run frontend, backend, and Redis using Docker Compose
- `make db:migrate` — run Prisma migrations for the backend
- `make db:seed` — seed the backend database with initial data
- `make lint` — lint the entire workspace
- `make test` — run frontend tests

## Project goals

This monorepo is structured for a scalable SaaS platform with:

- modular frontend and backend services
- shared type-safe schemas
- a local containerized dev environment
- secure JWT auth and protected API routes
- extensible AI pipeline integration

## Notes

- Local development uses SQLite by default. The backend is configured so PostgreSQL can be swapped in later.
- The frontend login page communicates with the backend auth service and demonstrates the protected `/api/hello` route.
- Swagger documentation is available at `/api/docs` once the backend is running.

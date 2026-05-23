# AURA Architecture Document

## 1. System diagram (textual)

AURA is designed as a modern SaaS BI platform with the following logical components:

- Frontend
  - A user-facing React/Next.js dashboard and landing experience.
  - Provides secure login, upload controls, charts, insight summaries, and recommendations.
- API Gateway
  - Edge entry point for all HTTP requests.
  - Handles authentication, authorization, request validation, and rate limiting.
  - For this phase, implemented as a collection of Next.js app routes; later can be split into a dedicated API gateway service.
- Backend Services
  - Core application service responsible for dataset ingestion, business logic, analytics orchestration, and user management.
  - Exposes endpoints for dataset upload, analysis execution, predictions retrieval, solution generation, and dashboard summary.
- AI Engine
  - A simulation/mock inference engine in the first phase that returns structured, realistic insights.
  - Abstracted behind a service interface so it can swap to OpenAI GPT-4o with minimal configuration.
- Database
  - PostgreSQL stores tenants, companies, users, datasets, analysis results, predictions, recommendations, and income forecasts.
  - Prisma ORM manages schema, migrations, and type-safe access.
- Cache
  - Redis stores short-term request caches, rate limit counters, session metadata, and frequently accessed dashboard aggregates.

## 2. Complete tech stack

- Frontend
  - `Next.js 14.2.5` with `React 18.3.1`
  - `TypeScript 5.6.3`
  - `Tailwind CSS 3.4.4`
  - `Recharts 2.8.0`
  - `Lucide React 0.473.0`
- Backend
  - `Node.js 20` runtime
  - `Next.js` app routes / API routes for backend service layer
  - `Prisma 5.14.0` ORM
  - `zod 3.23.2` for validation
  - `Fastify` or `Express` recommended for future dedicated services
- Database
  - `PostgreSQL 16` for transactional and relational data
- Cache
  - `Redis 7` for rate limiting, session state, and analytics caching
- Containerization
  - `Docker 24` and `docker-compose` for local/dev service orchestration
- Observability
  - Structured JSON logs
  - Health checks via `/api/health`
  - Optional future integration with `Sentry`, `Prometheus`, and `Grafana`
- CI/CD
  - GitHub Actions for linting, type checking, testing, and build/image validation
- Deployment
  - Render, Fly.io, or Railway free-tier deployments
  - Environment configuration through secure platform vars

## 3. Data models

### Company

- `id: String` - UUID or cuid
- `name: String`
- `slug: String` - unique tenant identifier
- `industry: String`
- `planTier: String` - e.g. `startup`, `growth`, `enterprise`
- `timezone: String`
- `createdAt: DateTime`
- `updatedAt: DateTime`
- `users: User[]`
- `datasets: Dataset[]`
- `analysisResults: AnalysisResult[]`
- `predictions: Prediction[]`
- `recommendations: Recommendation[]`
- `incomeForecasts: IncomeForecast[]`

### User

- `id: String`
- `companyId: String`
- `email: String`
- `name: String`
- `role: Enum('ADMIN', 'MANAGER', 'VIEWER')`
- `passwordHash: String` or external auth provider reference
- `lastLogin: DateTime`
- `createdAt: DateTime`
- `updatedAt: DateTime`

### Dataset

- `id: String`
- `companyId: String`
- `filename: String`
- `contentType: String`
- `size: Int`
- `status: Enum('PENDING', 'PROCESSING', 'PROCESSED', 'ERROR')`
- `recordCount: Int`
- `schemaSummary: Json`
- `source: String` - `csv`, `json`, `manual`
- `uploadedAt: DateTime`
- `processedAt: DateTime?`
- `errorMessage: String?`

### AnalysisResult

- `id: String`
- `companyId: String`
- `datasetId: String`
- `category: String` - e.g. `Revenue`, `Retention`, `Operations`
- `summary: String`
- `insights: Json`
- `confidence: Float`
- `status: Enum('DRAFT', 'COMPLETED', 'FAILED')`
- `executedAt: DateTime`

### Prediction

- `id: String`
- `companyId: String`
- `metric: String`
- `value: Float`
- `horizon: String` - e.g. `Monthly`, `Quarterly`, `Annual`
- `source: String` - `mock`, `llm`, `statistical`
- `generatedAt: DateTime`
- `metadata: Json?`

### Recommendation

- `id: String`
- `companyId: String`
- `analysisResultId: String?`
- `title: String`
- `description: String`
- `priority: Enum('HIGH', 'MEDIUM', 'LOW')`
- `category: String`
- `status: Enum('OPEN', 'IN_PROGRESS', 'COMPLETED')`
- `createdAt: DateTime`
- `updatedAt: DateTime`

### IncomeForecast

- `id: String`
- `companyId: String`
- `forecastPeriod: String` - `Next 30 days`, `Next 12 months`
- `projectedRevenue: Float`
- `projectedCost: Float`
- `projectedProfit: Float`
- `confidence: Float`
- `createdAt: DateTime`
- `updatedAt: DateTime`

## 4. API design

### Authentication

- `POST /api/auth/signup`
  - Registers a new company and admin user
  - Request: `{ name, email, password, companyName }`
  - Response: `{ token, user, company }`
- `POST /api/auth/login`
  - Request: `{ email, password }`
  - Response: `{ token, refreshToken, user }`
- `POST /api/auth/refresh`
  - Request: `{ refreshToken }`
  - Response: `{ token }`
- `POST /api/auth/logout`
  - Invalidates refresh token

### Dataset upload

- `POST /api/datasets/upload`
  - Accepts multipart file uploads
  - Validates CSV/JSON payloads and stores dataset metadata
  - Request: `multipart/form-data` with `file`
  - Response: `{ datasetId, status, message }`

### Run analysis

- `POST /api/analysis/run`
  - Starts analysis for an uploaded dataset
  - Request: `{ datasetId, analysisType }`
  - Response: `{ analysisResultId, status }`
- `GET /api/analysis/:id`
  - Fetches a completed analysis result
  - Response: `{ id, summary, insights, confidence, executedAt }`

### Get predictions

- `GET /api/predictions`
  - Returns latest predictions for the company
  - Query: `horizon`, `metric`
  - Response: `{ data: Prediction[] }`
- `GET /api/predictions/:id`
  - Returns a single prediction detail

### Get solutions / recommendations

- `GET /api/recommendations`
  - Returns actionable recommendations from AI analysis
  - Response: `{ data: Recommendation[] }`
- `POST /api/recommendations/acknowledge`
  - Marks recommendation progress or completion

### Dashboard summary

- `GET /api/dashboard/summary`
  - Aggregates latest metrics, predictions, insights, and forecast highlights
  - Response: `{ revenue, growth, riskSignals, topRecommendations, forecast }`

### User and company management

- `GET /api/users/me`
  - Returns the current user profile
- `GET /api/companies/:id`
  - Returns tenant/company details
- `GET /api/datasets`
  - Lists uploaded datasets and ingestion statuses

### Health and observability

- `GET /api/health`
  - Returns `{ status: 'ok', uptime, timestamp }`
- `GET /api/health/readiness`
  - Verifies database and cache readiness
- `GET /api/health/liveness`
  - Verifies service process health

## 5. AI pipeline design

### Phase 2: mock/simulation engine

- The AI Engine exposes a service interface:
  - `runDatasetAnalysis(datasetId)`
  - `generatePredictions(companyId)`
  - `buildRecommendations(analysisId)`
- The first implementation returns deterministic mock data and realistic business intelligence sample outputs.
- Mock engine outputs are stored as `AnalysisResult`, `Prediction`, `Recommendation`, and `IncomeForecast` records.
- The service is abstracted behind a configuration switch:
  - `AI_ENGINE_MODE = mock` or `AI_ENGINE_MODE = llm`

### Swappable real LLM design

- When `AI_ENGINE_MODE=llm`, the service sends structured prompts to OpenAI GPT-4o.
- Use a single config block in `app/config/ai.ts` or environment variable mapping:
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL=gpt-4o-mini`
  - `OPENAI_TEMPERATURE=0.4`
- The AI service should accept:
  - dataset metadata
  - company context
  - historical predictions
  - business objectives
- The AI service returns:
  - insight summary
  - identified strengths and weaknesses
  - risk flags
  - prioritized recommendations
  - income forecast guidance
- The engine remains stateless; all outputs are persisted after generation.

## 6. Security plan

### Authentication and authorization

- JWT access tokens for API authentication
- Refresh tokens for session renewal
- `Authorization: Bearer <token>` for all secured endpoints
- Role-based access control (RBAC):
  - `Admin` - full access, user/company management
  - `Manager` - dataset upload, analysis, predictions, recommendations
  - `Viewer` - read-only dashboard and insights
- Protect user/company resources with tenant scoping on every query

### File upload validation

- Accept only structured business data types: CSV, JSON
- Validate file metadata and size limits
- Parse and inspect headers before persistence
- Reject unsupported files with explicit errors
- Store only metadata and secure references, not raw uploaded payloads in the DB

### Rate limiting and abuse protection

- Apply per-user and per-tenant rate limits on API endpoints
- Throttle dataset uploads and analysis triggers
- Use Redis or platform built-in rate limit stores

### Secure defaults

- Enforce HTTPS in staging / production
- Use secure cookies and `SameSite=strict` for auth flows
- Sanitize all user inputs with `zod`
- Use prepared database queries via Prisma
- Store secrets in environment variables, not code

## 7. Observability

### Logging

- Structured JSON logs for backend services
- Log request IDs, user IDs, tenant IDs, and correlation IDs
- Log AI pipeline invocation, dataset ingestion status, and errors

### Health checks

- `GET /api/health` for basic service status
- `GET /api/health/readiness` for DB/cache readiness checks
- `GET /api/health/liveness` for process health

### Monitoring roadmap

- Add Prometheus-compatible metrics later
- Add alerting on failed uploads, AI errors, and auth failures
- Add Sentry or equivalent for error tracking

## 8. CI/CD

### GitHub Actions workflow

- `lint` - run `npm run lint`
- `typecheck` - run `npm run typecheck`
- `test` - run `npm run test -- --run`
- `build` - run `npm run build`
- Optionally build Docker image for validation
- Deploy on merge to `main` via staging and production pipelines

### Recommended pipeline stages

1. Install dependencies
2. Run static analysis and lint
3. Run type checks
4. Run unit and integration tests
5. Build the application
6. Build and validate Docker image
7. Deploy to staging environment

## 9. Deployment strategy

### Target platforms

- Render
  - `Render Web Service` for frontend and backend
  - `Render PostgreSQL` for DB
  - Environment variables configured in Render dashboard
- Fly.io
  - Deploy services as micro VMs
  - Use managed PostgreSQL or external DB add-on
- Railway
  - Use Railway services for web app and database
  - Free tier for prototypes and staging

### Deployment architecture

- Frontend and backend can deploy as a single Next.js app on Vercel/Render or as separate services if split later
- PostgreSQL and Redis provisioned as managed services
- Store environment variables securely:
  - `DATABASE_URL`
  - `REDIS_URL`
  - `JWT_SECRET`
  - `OPENAI_API_KEY`
  - `AI_ENGINE_MODE`
  - `NEXTAUTH_URL` (if using next-auth later)

### Free staging recommendation

- Use Render for the app and database with free-tier service plans
- Use Railway for an alternative staging stack
- Use GitHub Actions to deploy to staging on pushes to `main`

## 10. Phase 2 additions

- Add a dedicated auth service and user onboarding flows
- Implement Redis caching for dashboard aggregates and rate limiting
- Add a mock AI service with `AI_ENGINE_MODE=mock`
- Build the admin console for tenant and role management
- Enable observability and health endpoints for production readiness
- Keep the architecture modular so the AI engine and backend services can scale independently

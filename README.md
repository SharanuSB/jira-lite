# Jira Lite — Mini Task Management System

A full-stack task management app built with React, Node.js/Express, and PostgreSQL.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS, Vite |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL 16 |
| Validation | Zod |
| Server State | TanStack React Query v5 |
| Testing | Jest + Supertest (backend), Vitest + React Testing Library (frontend) |
| Shared Types | Monorepo workspace (`@jira-lite/shared`) |

---

## Project Structure

```
jira-lite/
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared TypeScript types and constants
└── docker-compose.yml
```

---

## Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Getting Started

### 1. Clone the repo

```bash
git clone <repo-url>
cd jira-lite
```

### 2. Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL database on port `5432`.

### 3. Set up the backend

```bash
cd server
cp .env.example .env
npm install
npm run migrate
npm run dev
```

Backend runs at: `http://localhost:5000`

### 4. Set up the frontend

Open a new terminal tab:

```bash
cd client
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Environment Variables

The `server/.env` file (copied from `.env.example`) contains:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=jira_lite
NODE_ENV=development
```

---

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Get all tasks (paginated) |
| GET | `/tasks/:id` | Get a single task |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### Query Parameters for GET `/tasks`

| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |
| `status` | string | Filter by `todo`, `in_progress`, or `done` |
| `priority` | string | Filter by `low`, `medium`, or `high` |
| `search` | string | Search by task title |

---

## Running Tests

### Backend

```bash
cd server
npm test
```

### Frontend

```bash
cd client
npm test
```

---

## Features

- **CRUD** — Create, view, edit and delete tasks
- **Priority** — Tasks have low / medium / high priority levels
- **Filters** — Filter by status, search by title (debounced), filter by priority
- **Pagination** — Server-side pagination, 10 tasks per page
- **Validation** — Zod validation on all inputs, UUID validation on route params
- **Error Handling** — Proper 400/404/500 responses, user-friendly error messages
- **Rate Limiting** — 100 requests per IP per 15 minutes
- **Request Logging** — Morgan logs all HTTP requests in the terminal
- **Toast Notifications** — Success/error toasts on all actions
- **Shared Types** — Frontend and backend share the same TypeScript types via `@jira-lite/shared`

---

## Architecture

### Backend — Controller → Service → Repository

```
Request → Route → Middleware (validation) → Controller → Service → Repository → DB
```

- **Controller** — handles HTTP request/response only
- **Service** — business logic, throws `NotFoundError` when task not found
- **Repository** — all SQL queries live here, nothing else touches the DB

### Frontend — React Query + Context API

```
Component → useTaskContext → TaskContext (React Query) → Axios → Backend API
```

- **React Query** — handles fetching, caching, retries, and cache invalidation after mutations
- **TaskContext** — thin wrapper that exposes React Query state to components via Context API
- **Axios interceptor** — transforms backend validation errors into readable messages centrally
- **useDebounce** — prevents API call on every keystroke, fires after 400ms

### React Query Benefits

| Manual approach (before) | React Query (now) |
|---|---|
| Manual loading/error/data state | Built-in `isLoading`, `error`, `data` |
| Custom `withRetry` function | `retry: 2` option |
| `useEffect` + `useCallback` for fetch | `queryKey` change triggers fetch automatically |
| Manual refetch after mutations | `invalidateQueries` handles it |
| No caching | 30s stale time — cached results shown instantly |

### Database Schema

```sql
CREATE TABLE tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      VARCHAR(50) NOT NULL DEFAULT 'todo',
  priority    VARCHAR(50) NOT NULL DEFAULT 'medium',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Indexes on `status`, `priority`, `created_at`, and GIN full-text index on `title`.

### Migrations

Migrations run in order and are tracked in a `schema_migrations` table — they never run twice.

```bash
npm run migrate   # runs any pending migrations
```

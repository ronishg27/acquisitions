# Acquisitions API — OpenCode guide

## Setup

- Copy `.env.example` → `.env`, fill `DATABASE_URL` (Neon PostgreSQL) and `JWT_SECRET`
- `npm install`
- Requires Node.js ESM (`"type": "module"` in package.json)

## Commands

| npm run …      | Action                      |
| -------------- | --------------------------- |
| `dev`          | `node --watch src/index.js` |
| `start`        | `node src/index.js`         |
| `lint`         | `eslint .`                  |
| `lint:fix`     | `eslint . --fix`            |
| `format`       | `prettier --write .`        |
| `format:check` | `prettier --check .`        |
| `db:generate`  | `drizzle-kit generate`      |
| `db:migrate`   | `drizzle-kit migrate`       |
| `db:push`      | `drizzle-kit push`          |
| `db:studio`    | `drizzle-kit studio`        |

**DB workflow (recommended):** `db:generate` → `db:migrate`. Use `db:push` for prototyping only.

## Architecture

- **Express 5** REST API (no views, JSON-only responses)
- Entry: `src/index.js` → `src/server.js` → `src/app.js`
- Every `src/*/` folder uses a barrel `index.js` — always import from the barrel, not individual files
- **Subpath imports** (never relative paths across packages):
  ```
  #config, #controllers, #models, #routes, #services, #utils, #validations
  ```
- **Request flow:** route handler → Zod validation → controller → service → Drizzle model
- Logger via `#config` (Winston, file + console in non-production)

## Code style

- ESLint flat config: 2-space indent, single quotes, semicolons, unix linebreaks, `prefer-const`, `no-var`
- Prettier: single quotes, trailingComma `es5`, arrow parens `avoid`, printWidth 80, LF eol
- Run `lint` then `format:check` before committing

## Known quirks / gotchas

- `JWT_SECRET` env var is required at module load time — server crashes on startup if missing
- `db.insert(...).returning(...)` returns an **array** — always destructure `result[0]`
- `POST /api/v1/auth/sign-in` and `/sign-out` are unimplemented stubs
- `POST /api/v1/auth/sign-up` has an **active bug**: `createUser` returns an array but the controller accesses `user.id` directly
- No auth middleware exists yet (`src/middleware/index.js` is empty)
- No test framework installed — do not attempt to run tests
- No CI/CD pipelines exist

## Database

- Schema files: `src/models/*.js` (Drizzle `pgTable`)
- Migrations: `drizzle/` directory (SQL files)
- Driver: `@neondatabase/serverless` (HTTP, not WebSocket — no connection pool needed)
- `drizzle.md` in root has a full command reference

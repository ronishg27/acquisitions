# Drizzle Kit Commands Reference

## Common Scripts

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:pull": "drizzle-kit pull",
    "db:check": "drizzle-kit check"
  }
}
```

---

# `db:generate`

```bash
npm run db:generate
```

### Purpose

Generates SQL migration files based on changes in your Drizzle schema.

### Use when

- You want to keep a history of database changes.
- You're working on a team.
- You're deploying to production.

### Result

```
schema.ts
      ↓
SQL migration file
```

> Does **not** modify the database.

---

# `db:migrate`

```bash
npm run db:migrate
```

### Purpose

Executes pending SQL migration files on the database.

### Result

```
Migration files
        ↓
Database updated
```

> Best used together with `generate`.

---

# `db:push`

```bash
npm run db:push
```

### Purpose

Synchronizes your schema directly with the database **without creating migration files**.

### Result

```
schema.ts
      ↓
Database updated immediately
```

### Use when

- Rapid prototyping
- Personal projects
- Early development
- You don't need migration history

### Advantages

- Faster workflow
- No migration files to manage

### Disadvantages

- No version history
- Harder to track schema changes
- Not recommended for production or collaborative projects

---

# `db:pull`

```bash
npm run db:pull
```

### Purpose

Generates a Drizzle schema from an existing database.

### Result

```
Existing Database
        ↓
schema.ts
```

### Useful when

- Working with an existing database
- Reverse engineering a schema
- Migrating a project to Drizzle ORM

---

# `db:studio`

```bash
npm run db:studio
```

### Purpose

Opens Drizzle Studio.

### Features

- Browse tables
- View records
- Insert data
- Update data
- Delete data

---

# `db:check`

```bash
npm run db:check
```

### Purpose

Checks whether your schema and migrations are in sync.

Useful for catching migration issues before deployment.

---

# Which workflow should I use?

## Option 1 — Migration Workflow (Recommended)

```
Edit schema
      ↓
generate
      ↓
Migration SQL created
      ↓
migrate
      ↓
Database updated
```

**Recommended for:**

- Production applications
- Team projects
- Applications where schema history matters

---

## Option 2 — Push Workflow

```
Edit schema
      ↓
push
      ↓
Database updated
```

**Recommended for:**

- Learning Drizzle
- Prototyping
- Hackathons
- Small personal projects

---

# Quick Comparison

| Command    | Creates SQL Migration? | Updates Database? | Common Use                    |
| ---------- | ---------------------- | ----------------- | ----------------------------- |
| `generate` | ✅ Yes                 | ❌ No             | Create migration files        |
| `migrate`  | ❌ No                  | ✅ Yes            | Apply migrations              |
| `push`     | ❌ No                  | ✅ Yes            | Sync schema directly          |
| `pull`     | ❌ No                  | ❌ No             | Generate schema from database |
| `studio`   | ❌ No                  | ❌ No             | Database GUI                  |
| `check`    | ❌ No                  | ❌ No             | Validate migrations           |

---

# Recommendation

For most real-world projects, use the migration workflow:

```bash
npm run db:generate
npm run db:migrate
```

Use `db:push` only when you don't need migration history and want to iterate quickly during development.

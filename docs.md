# Project Docs

This file explains how to work in this Electron project, where code should live, and how to keep the codebase clean as the app grows.

## Stack

- Electron
- `electron-vite`
- React
- TypeScript
- Drizzle ORM
- SQLite/libSQL
- Tailwind CSS v4
- shadcn/ui
- TanStack Query

## Architecture

This project has 3 main runtime layers:

1. `src/main`
   The Electron main process. This is where native app logic lives:
   - window creation
   - app lifecycle
   - IPC handlers
   - database access
   - file system / OS integrations

2. `src/preload`
   The secure bridge between renderer and main.
   - exposes a small `window.api`
   - forwards calls with `ipcRenderer`
   - should stay thin

3. `src/renderer`
   The React UI.
   - pages and components
   - hooks
   - feature UI
   - TanStack Query setup
   - calls `window.api`, never talks directly to Node or the database

## Folder Structure

```txt
.
├── components.json
├── docs.md
├── drizzle/
├── electron-builder.yml
├── electron.vite.config.ts
├── scripts/
│   └── seed.ts
├── src/
│   ├── main/
│   │   ├── db/
│   │   │   ├── db.ts
│   │   │   ├── database-url.ts
│   │   │   └── models/
│   │   │       └── schema.ts
│   │   ├── ipc/
│   │   │   └── register-ipc.ts
│   │   ├── modules/
│   │   │   └── users/
│   │   │       ├── user.repository.ts
│   │   │       └── users.ipc.ts
│   │   └── index.ts
│   ├── preload/
│   │   ├── index.d.ts
│   │   └── index.ts
│   ├── renderer/
│   │   ├── index.html
│   │   └── src/
│   │       ├── assets/
│   │       ├── components/
│   │       ├── features/
│   │       ├── lib/
│   │       ├── App.tsx
│   │       ├── env.d.ts
│   │       └── main.tsx
│   └── shared/
│       ├── ipc/
│       │   └── channels.ts
│       └── types/
│           └── user.ts
├── tsconfig.node.json
├── tsconfig.web.json
└── README.md
```

## What Goes Where

### `src/main`

Use this layer for anything privileged or app-level.

Put these here:
- Electron app startup
- `BrowserWindow` creation
- database initialization
- Drizzle queries
- IPC handlers
- update logic
- file dialogs
- filesystem access
- OS integrations

Do not put React UI code here.

### `src/main/db`

Database-related code only.

- `db.ts`
  Creates and returns the Drizzle database instance.
- `database-url.ts`
  Resolves the SQLite/libSQL URL.
- `models/schema.ts`
  Drizzle schema definitions.

Rule:
- schema and DB setup live here
- feature queries should not be written directly in `index.ts`

### `src/main/modules`

Feature-based main-process logic.

Current example:
- `modules/users/user.repository.ts`
  Contains database queries for users.
- `modules/users/users.ipc.ts`
  Registers IPC handlers for the users feature.

Rule:
- repository = data access
- ipc file = handler registration and mapping
- keep feature logic grouped by domain

### `src/main/ipc`

This folder is the entry point for registering all IPC handlers.

Current file:
- `register-ipc.ts`

Rule:
- main `index.ts` should call one registration function
- do not scatter `ipcMain.handle(...)` calls all over the project

### `src/preload`

This layer exposes a safe API to the renderer.

Current pattern:
- `index.ts` defines `window.api.users.list()`
- `index.d.ts` types the global `window.api`

Rule:
- preload should be thin
- no business logic
- no DB logic
- no heavy transformations
- only expose safe, small APIs

### `src/renderer/src`

This is the frontend app.

Suggested responsibilities:
- `components/`
  Shared UI components
- `components/ui/`
  shadcn/ui components
- `features/`
  Feature-specific UI and hooks
- `lib/`
  Helpers such as `cn()`
- `assets/`
  CSS, icons, and static assets

Rule:
- the renderer should only call `window.api`
- renderer must not access Electron internals directly

### `src/shared`

Use this for code shared across main, preload, and renderer.

Current examples:
- `shared/ipc/channels.ts`
  Shared IPC channel names
- `shared/types/user.ts`
  Shared DTO types

Rule:
- anything sent over IPC should use shared types when possible

## Data Flow

This is the expected flow for app features:

```txt
Renderer -> Preload -> Main IPC -> Repository -> Database
Database -> Repository -> Main IPC -> Preload -> Renderer
```

Example:

1. React component calls `window.api.users.list()`
2. Preload uses `ipcRenderer.invoke(...)`
3. Main handles the IPC call
4. Repository queries Drizzle
5. Result is returned to the UI

## How To Add A New Feature

Example: `projects`

1. Add schema if needed
   - `src/main/db/models/schema.ts`

2. Add repository
   - `src/main/modules/projects/project.repository.ts`

3. Add IPC handlers
   - `src/main/modules/projects/projects.ipc.ts`

4. Register the handlers
   - update `src/main/ipc/register-ipc.ts`

5. Add shared channel names
   - `src/shared/ipc/channels.ts`

6. Add shared DTO types if needed
   - `src/shared/types/project.ts`

7. Expose preload API
   - update `src/preload/index.ts`
   - update `src/preload/index.d.ts`

8. Build renderer feature
   - `src/renderer/src/features/projects/`

This keeps every feature consistent.

## UI Conventions

- Use `@/` imports for renderer files
- Keep shared reusable UI in `src/renderer/src/components`
- Keep shadcn-generated files in `src/renderer/src/components/ui`
- Keep feature-specific screens/components in `src/renderer/src/features`
- Use `src/renderer/src/lib` for small frontend utilities

## Database Conventions

- Use Drizzle schema in `src/main/db/models/schema.ts`
- Use repositories for queries
- Do not query the database from preload
- Do not query the database from renderer
- Seed scripts belong in `scripts/`

## Important Root Files

- `package.json`
  Scripts and dependencies

- `electron.vite.config.ts`
  Vite config for main, preload, and renderer

- `electron-builder.yml`
  Packaging configuration

- `dev-app-update.yml`
  Dev updater configuration

- `components.json`
  shadcn/ui configuration

- `.env`
  Local environment variables such as `DB_FILE_NAME`

## Common Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run db:migrate
npm run db:seed
npm run build
```

## Project Rules

- Keep `main`, `preload`, and `renderer` responsibilities separate.
- Keep preload thin.
- Prefer feature-based folders inside `src/main/modules` and `src/renderer/src/features`.
- Share IPC channel names and DTOs from `src/shared`.
- Avoid putting feature logic directly in `src/main/index.ts`.
- Avoid large React components; split by feature and responsibility.
- Prefer consistent naming:
  - `*.repository.ts` for data access
  - `*.ipc.ts` for IPC handlers
  - `*.d.ts` for exposed API typings

## Recommended Growth Path

As the app grows, keep this structure:

- one folder per domain in `src/main/modules`
- one folder per feature in `src/renderer/src/features`
- shared transport types in `src/shared`
- shared UI in `src/renderer/src/components`

If the project gets larger, the next good step is:

- add `services/` inside each feature when business logic grows
- add `queries/` for TanStack Query option factories in the renderer
- add `hooks/` inside features for UI-facing feature hooks

## Summary

Use this mental model:

- `main` = native app + DB + IPC handlers
- `preload` = secure bridge
- `renderer` = UI
- `shared` = contract between layers

If you keep following that split, the project will stay clean and maintainable.

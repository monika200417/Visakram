# Visakram Builders — website

React + TypeScript + Vite. Project specification lives in [`docs/`](docs/) — start with
[`docs/CLAUDE.md`](docs/CLAUDE.md).

## Scripts

| Command                           | Purpose                        |
| --------------------------------- | ------------------------------ |
| `npm run dev`                     | Start the dev server           |
| `npm run typecheck`               | TypeScript project build check |
| `npm run lint`                    | ESLint                         |
| `npm run format` / `format:check` | Prettier                       |
| `npm test`                        | Vitest unit/component tests    |
| `npm run build`                   | Typecheck + production build   |
| `npm run preview`                 | Serve the production build     |

## Environment

Copy `.env.example` to `.env.local`. Only public values may use the `VITE_` prefix — never secrets.

## Status

Milestone 1 (foundation) — routing shell, data layer, tooling. Pages are development placeholders.

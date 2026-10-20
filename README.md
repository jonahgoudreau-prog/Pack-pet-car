# Pack

A web app that helps a household take care of their dog together: who fed her, who walked her, and whether her meds were given. It's built to be added to the iPhone Home Screen and used like an app.

The product spec is in [`docs/SPEC.md`](docs/SPEC.md), the design mockups in [`design/`](design/), and setup steps in [`docs/SETUP.md`](docs/SETUP.md).

## Status

**Phase 0: setup.** An installable PWA shell checks three things: that it runs from the Home Screen, that it works offline, and that it can reach Supabase. No features yet.

## Stack

- **Frontend:** Vite, React and TypeScript, as an installable PWA ([vite-plugin-pwa](https://vite-pwa-org.netlify.app/), with our own service worker in `src/sw.ts`).
- **Backend:** Supabase (Postgres, Auth, Realtime, Storage, Edge Functions, Cron).
- **Hosting:** Cloudflare Workers static assets, auto-deployed from `main` by Workers Builds, with a preview for every other branch.
- **CI:** GitHub Actions runs type-checking, lint, tests and a build on every push. A second workflow applies Supabase migrations and deploys Edge Functions when `supabase/` changes on `main`.

## Layout

```
src/
  App.tsx              Phase 0 shell screen
  sw.ts                Service worker (precache the app shell; push handlers come in Phase 3)
  pwa/                 Service worker registration and status
  lib/                 Pure logic with unit tests
  styles/tokens.css    Design tokens (palette, type, radii, spacing) as CSS variables
  assets/fonts/        Urbanist, self-hosted (SIL OFL)
public/                Icons, _headers
scripts/               generate-icons.mjs (npm run icons)
supabase/              Supabase CLI project: migrations and Edge Functions
design/                HTML mockups (reference only, not shipped)
docs/SETUP.md          Click-by-click setup from an iPhone
wrangler.jsonc         Cloudflare config (static SPA)
```

## Scripts

| Command             | What it does                                             |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Local dev server                                         |
| `npm run check`     | Type-check, lint, test and build (run before every push) |
| `npm run typecheck` | `tsc -b` across the app, service worker and config       |
| `npm run lint`      | ESLint and Prettier check                                |
| `npm run format`    | Prettier write                                           |
| `npm test`          | Vitest                                                   |
| `npm run icons`     | Regenerate the app icons                                 |

For local development against Supabase, copy `.env.example` to `.env.local` and fill it in. Never commit real values.

## Decisions

- **Cloudflare Workers, not Pages.** Cloudflare now points new projects to Workers static assets, and that's where new features land, such as per-branch Worker Previews. The free plan allows commercial use, and static asset requests are free and unlimited.
- **Supabase changes deploy from GitHub Actions** using the Supabase CLI, so migrations and Edge Functions ship from `main` without a laptop.
- **Supabase publishable key** (`sb_publishable_…`) instead of the legacy `anon` key, which Supabase is retiring.
- **The app updates itself.** The service worker takes over as soon as a new deploy is found, and Pack checks for one every time it comes to the foreground. Home Screen apps have no reload button, so this keeps phones current.

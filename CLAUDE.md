# Pack

Read `docs/SPEC.md` first. It's the product spec, the phase plan and how Jonah works: from an iPhone only, so every manual step needs click-by-click Safari instructions.

- Build one phase at a time. At the end of each phase, stop and give exact on-phone test steps.
- Run `npm run check` (type-check, lint, tests, build) before every push. CI runs the same checks.
- Never commit secrets. Frontend config is in Cloudflare build variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`). Supabase deploy credentials are GitHub Actions secrets (see `docs/SETUP.md`).
- Database changes go in `supabase/migrations/`. They deploy from `main` through `.github/workflows/supabase.yml`.
- Design: match `design/*.dc.html` for layout and hierarchy, and use the tokens in `src/styles/tokens.css`. Don't port the mockup HTML.
- Logic shared with Edge Functions (such as meal status) must be pure TypeScript with unit tests.

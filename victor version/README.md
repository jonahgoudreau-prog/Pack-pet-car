# Pack (Expo app)

An iPhone app that helps a household look after their dog together: meals, walks, meds and health trends. Built with Expo SDK 57, Expo Router and TypeScript. Backend (from Phase 1): Supabase.

- **Phone setup and testing:** see [SETUP.md](SETUP.md).
- **Design references:** `design/` (HTML mockups, visual reference only).

## Layout

```
src/app/            screens (Expo Router: every file is a route)
  (tabs)/           Today, Health, History, Settings
  household.tsx     pushed from Settings
  log.tsx           the "+" sheet
src/components/     shared UI (T text, cards, buttons, icons, tab bar)
src/theme/          color themes, Automatic light/dark, Urbanist fonts
src/lib/            pure helpers and small wrappers around native modules
assets/fonts/       Urbanist (SIL Open Font License, see OFL.txt)
```

## Themes

Colors only come from `src/theme/palettes.ts`. Settings → Appearance has **Automatic** (default: Butter by day, Dark at night, following the iPhone), **Light** and **Dark**, plus a choice of light color and dark style. A test checks every theme for readable contrast.

## Checks

```bash
npm run typecheck
npm run lint
npm test
```

GitHub Actions (`.github/workflows/pack-app.yml`) runs these on every push, then publishes an EAS Update for Expo Go from `main` and `victor-version`.

# Pack: build spec (web app)

You're building **Pack**, a web app that helps a household take care of their dog together: who fed her, who walked her, and whether her meds were given. People add it to their iPhone Home Screen and use it like an app. The core promise: everyone in the house knows the dog's status, and anyone can log something in one tap.

A website can't make real iPhone widgets, so we get close another way: an Apple Shortcut gives one-tap logging from the Home Screen, Action Button and Control Center, and web push notifications keep everyone in the loop. If this version proves people use it, a native iOS app with real widgets comes later on the same backend.

## How I'm working (read this first)

I'm Jonah. I'm doing everything from my iPhone, running you in Claude Code on the web. No Mac, no laptop.

- The site deploys automatically from GitHub, so every push to main goes live and I test it on my phone. Use preview deploys for branches when that helps.
- Any manual step (Supabase dashboard, Cloudflare, Stripe, GitHub settings, the Shortcuts app) must be doable in Safari or apps on an iPhone. Give me click-by-click steps, and tell me when to switch Safari to the desktop site.
- Never commit secrets. Tell me exactly which key goes where.
- Build in the phases at the bottom of this file. At the end of each phase, deploy, then stop and tell me exactly what to test on my phone before moving on. Commit after each meaningful step.
- Run type-checking, lint and tests before every push, and set up a GitHub Actions workflow (Linux runner) that runs them on every push.
- Write tests for the meal-status logic and the overdue-reminder job.
- If anything in this spec is impossible or a bad idea, tell me and propose the better option instead of quietly working around it.
- Everything should run on free tiers until I say we're charging money.

## Stack

- **Frontend:** Vite, React and TypeScript, built as an installable PWA: web app manifest, service worker, app icons including `apple-touch-icon`, `display: standalone`, and a Butter theme color. Design tokens as CSS variables.
- **Backend:** Supabase only: Postgres, Auth, Realtime, Storage, Edge Functions and Cron. No other server.
- **Hosting:** Cloudflare, auto-deploying from GitHub. Not Vercel, because its free plan is limited to non-commercial use and we plan to charge.
- **Push:** standard Web Push with VAPID keys, sent from a Supabase Edge Function.
- **Payments (last phase):** Stripe Checkout, the Stripe Customer Portal, and a webhook handled by an Edge Function.

## iPhone web app rules that will bite you

- **Push only works after install.** iOS only allows web push for sites added to the Home Screen, and permission has to be requested from a tap. Detect whether Pack is running standalone and walk people through installing it first.
- **No magic links.** The Home Screen app has separate storage from Safari, so a magic link opens in Safari and signs in the wrong place. Use 6-digit email codes (Supabase email OTP) for sign-in.
- **No background location.** Safari can't track location when the phone is locked, so there's no GPS tracking for walks in v1. A walk is a start and end timestamp stored on the server, so the timer survives a locked phone or a closed app.
- **No haptics.** iOS Safari doesn't support vibration. Use clear visual feedback instead.
- **iOS can clear web app storage.** The server is the source of truth. Keep local caching light.
- Respect safe areas (`env(safe-area-inset-*)`), use at least 16px text in inputs so iOS doesn't zoom, and make it feel native: no text selection on buttons, no double-tap zoom, no rubber-band glitches.
- Check whether newer iOS versions have changed any of this and tell me.

## Data model

Postgres with Row Level Security on every table, so a household only ever sees its own data.

- **households:** id, name, timezone, owner, plan (free or plus), Stripe customer and subscription ids.
- **members:** household, user, display name, role (owner or member), shortcut token (random, revocable).
- **invites:** code, household, created by, expiry.
- **pets:** id, household, name, photo (Supabase Storage, resized small), meal times (1 to 4 a day, default 7:30 AM and 6:00 PM), daily walk goal in minutes (default 60), sort order.
- **events:** id, household, pet, type (meal, walk, med), logged by, created at, meal slot (meals), walk started and ended timestamps (walks), med (meds), optional note.
- **meds:** id, pet, name, schedule (daily at a set time for v1, but structured so every N days and monthly can be added later, since flea and heartworm meds are monthly), active flag.
- **push_subscriptions:** user, endpoint, keys, device label, created at.
- **notification_log:** what was sent and when, so reminders never double-send.
- **Undo** simply deletes the event.

## Core logic

- Meal status for each slot, as one pure TypeScript function shared by the frontend and the Edge Functions:
  - **done** if a meal event exists for that slot today
  - **due** starting 2 hours before the slot time
  - **overdue** 30 minutes after the slot time with nothing logged
- A meal logged near a slot fills that slot. If someone logs a meal when every slot is already full, ask: "Milo already had 2 meals today. Log another anyway?" Preventing double feeding is the whole reason this app exists, so this warning matters everywhere, including the Shortcut.
- "Today" uses the household's time zone and resets at local midnight.

## Design

Match the mockups in the `design/` folder: `Main.dc.html` (Home), `Walk.dc.html` (Walk) and `Setup.dc.html` (install and setup). They're HTML in a templating format: `{{brand}}` means Green, and `<sc-if>` blocks are alternate states (for example, the meal card before and after dinner is logged). Use them for layout, spacing, sizing and hierarchy. Don't port the HTML.

**Palette** (light mode only for v1):

| Name | Hex | Use |
|---|---|---|
| Butter | `#FFEFB3` | App background, text and buttons on Green |
| Cream | `#FFF8DE` | Cards and list rows, with a hairline border of `rgba(1,62,55,0.08)` |
| Green | `#013E37` | Text, hero meals card, nav bar, primary buttons |
| Muted green | `#4A6B65` | Secondary text on Butter and Cream |
| Muted on Green | `#B3BA8E` | Secondary text on Green |
| Tangerine | `#FF9F5A` | Alerts only: overdue states, the live dot |
| Khaki | `#C9CBA6` | Past days in the small charts |

Text on Green is always Butter. Text on Tangerine is always Green.

**Type:** Urbanist (Google Fonts, SIL Open Font License), self-hosted in the repo so it works offline. Big numbers use weight 800, tight letter spacing and tabular figures.

**Shape and feel:** big rounded corners (hero card 32px, cards 28px, list rows 22px, pills fully round), generous padding, one huge number as the focal point of each card, a subtle halftone dot texture on the Green hero card, and a floating Green pill tab bar with a large Butter center button. Icon-only buttons need accessible labels, and tap targets are at least 44px.

## Screens

1. **Sign in:** email, then a 6-digit code.
2. **Onboarding:** create a household or join one with an invite link, add your dog (name, optional photo, meal times), then go to Setup.
3. **Setup** (mockup `Setup`): three steps with progress. Add to Home Screen (detect standalone mode; show Safari's Share, then Add to Home Screen, with a picture), turn on notifications, and get the one-tap Fed shortcut (show the person's code with a copy button and a link to the shortcut). Reachable again later from Settings.
4. **Home** (mockup `Main`): date and greeting, pet switcher pills with a "+" to add a pet, the Green hero card showing meals fed today as a huge "1/2" with each slot's status and who logged it, and a big button whose label matches the next open slot ("Feed dinner"). Below that, two cards: Walks (minutes today, 7-day bar chart, taps into Walk) and Meds (next dose, 7-day dots). Then the "Today" timeline. Updates live through Supabase Realtime when someone else logs something. After any log, show an Undo toast for 5 seconds.
5. **Walk** (mockup `Walk`): a big ring filling toward the walk goal, a timer computed from the server start time, start time, walker, and goal. Everyone else's Home shows "Milo is out with Jonah · 12 min" while a walk is running.
6. **History:** events grouped by day, filterable by pet and type.
7. **Household:** member list, an invite link shared with the Web Share API, remove members, and regenerate your shortcut code.
8. **Settings:** pets (edit, meal times, walk goal), meds, notification preferences, plan and billing, setup again, sign out.

## One-tap logging with Apple Shortcuts

- An Edge Function endpoint accepts a POST with the member's shortcut token as a Bearer token and a body like `{ "type": "meal" }` (also `"walk_start"` and `"walk_end"`, and an optional pet if the household has more than one). A meal goes into the next open slot. It returns one short line of text the Shortcut shows, like "Logged dinner for Milo."
- If every meal slot is already full, don't log. Return "Milo already had 2 meals today. Open Pack to log another."
- Validate input and rate-limit the endpoint.
- I'll build the shortcut once on my iPhone and share it with an iCloud link. Give me exact steps to build it in the Shortcuts app (Get Contents of URL as a POST with the auth header, then Show Result), using an Import Question so each person pastes their own code when they add it. The Setup screen then links to it.
- In Setup, explain how to put the shortcut on the Home Screen (the Shortcuts widget), the Action Button, Control Center and the Lock Screen.

## Notifications (Web Push)

- Subscribe after install and only from a tap. Store one subscription per device and delete dead ones when a send returns 404 or 410.
- "Sam fed Milo" to the rest of the household when someone logs. On by default, can be turned off.
- Overdue reminders: a Supabase Cron job runs every 5 minutes, finds overdue meal slots in each household's time zone, and sends "Has anyone fed Milo?" once per slot (checked against notification_log). This job also keeps the free Supabase project from going idle.
- Med reminders at the scheduled time.
- Tapping a notification opens Pack to Home.

## Monetization (last phase, don't turn it on until I say)

- **Free:** one pet, solo use, meals, walks, the shortcut and notifications.
- **Pack Plus:** household sharing, unlimited pets, meds and reminders, full history. Only the household owner pays. Invited members join free.
- Stripe Checkout with a $14.99 yearly subscription and a $24.99 one-time lifetime option, the Stripe Customer Portal for managing it, and a webhook that updates the household's plan.
- During testing, use Stripe test mode only.

## Phases

0. **Setup, no features.** Walk me through creating the Supabase project, the Cloudflare deploy hooked to this repo, and the secrets. Ship a bare PWA shell (manifest, icons, service worker) that I can add to my Home Screen and open full screen. Don't start Phase 1 until I confirm.
1. Sign-in with email codes, households and invites, pets, meal logging, the Home screen with live updates and Undo, and the meal-status logic with tests.
2. Walks.
3. Web push: the Setup screen, "Sam fed Milo", the overdue cron job, and med reminders.
4. The Shortcuts endpoint and my step-by-step instructions for building the shortcut.
5. History, Settings, polish, and a placeholder app icon.
6. Stripe, only when I say.

## Later

If people stick with it, the next step is a native iOS app with real widgets. Keep the backend clean and documented so a future iOS app can use the same Supabase data and Edge Functions.

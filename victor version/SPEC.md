# Pack: build spec (Expo app)

You're building **Pack**, an iPhone app that helps a household take care of their dog together: who fed her, who walked her, and whether her meds were given. The core promise: everyone in the house knows the dog's status, and anyone can log something in one tap.

Pack is an Expo (React Native) app. v1 runs in **Expo Go** so I can build and test without an Apple Developer account. Features that Expo Go can't run (push notifications, widgets, in-app purchases) are planned for a later phase on an Expo **development build**, and the code should be written so that switch is easy.

## How I'm working (read this first)

I'm Victor. I'm doing everything from my iPhone, running you in Claude Code on the web. No Mac, no laptop.

- I test on my iPhone in Expo Go. **Before writing features, figure out how I can load the app in Expo Go from this setup** (the cloud workspace may not be able to run a tunnel for `npx expo start`). Publishing with EAS Update and opening the update in Expo Go is the likely route. Verify it works and give me the exact steps. If it can't work, tell me and propose the best alternative.
- Any manual step (Expo/EAS, Supabase dashboard, GitHub settings, App Store Connect later) must be doable in Safari or apps on an iPhone. Give me click-by-click steps, and tell me when to switch Safari to the desktop site.
- Never commit secrets. Tell me exactly which key goes where (EAS environment variables, Supabase secrets, GitHub secrets).
- Build in the phases at the bottom of this file. At the end of each phase, publish an update, then stop and tell me exactly what to test on my phone before moving on. Commit after each meaningful step.
- Run type-checking, lint and tests before every push, and set up a GitHub Actions workflow (Linux runner) that runs them on every push.
- Write tests for the meal-status logic, the care score, the streak, the health trends and alert rule, and the overdue-reminder job.
- If anything in this spec is impossible or a bad idea, tell me and propose the better option instead of quietly working around it.
- Everything should run on free tiers until I say we're charging money. Tell me before any step that costs money (for example, the $99/year Apple Developer Program).

## Stack

- **App:** Expo (latest SDK), React Native, TypeScript, Expo Router. Only use libraries that run in Expo Go for v1 phases. Keep anything that will need a development build behind a small wrapper so it can be swapped in later.
- **Backend:** Supabase only: Postgres, Auth, Realtime, Storage, Edge Functions and Cron. No other server.
- **Updates:** EAS Update for getting new versions onto my phone.
- **Later (development build phase):** EAS Build, Expo push notifications, iOS widgets, and in-app purchases.

## Expo Go limits that will bite you

- **No push notifications in Expo Go** (removed in SDK 53). v1 can't send "Sam fed Milo" or remote overdue alerts. Until the development build phase, the app shows live status through Supabase Realtime when it's open. Check whether local scheduled notifications still work in Expo Go and tell me. If they do, use them for meal and med reminders, and cancel a meal reminder when the app learns that slot was logged.
- **No widgets in Expo Go.** Widgets are designed (see Design) but built only in the development build phase.
- **No in-app purchases in Expo Go.** Payments wait for the development build.
- **No custom deep links or universal links in Expo Go.** Invites use a short code that people type in. Shareable invite links come later.
- **No background location.** Walks are a start and end timestamp stored on the server, so the timer survives a locked phone or a closed app.
- **Haptics work** (`expo-haptics`). Use a light tap on every log.
- Respect safe areas, keep tap targets at least 44pt, and support Dynamic Type reasonably.
- Check whether anything here has changed in the current Expo SDK and tell me.

## Data model

Postgres with Row Level Security on every table, so a household only ever sees its own data.

- **households:** id, name, timezone, owner, plan (free or plus), billing ids (empty until the payments phase).
- **members:** household, user, display name, role (owner or member), shortcut token (random, revocable).
- **invites:** code (6 characters, easy to type), household, created by, expiry.
- **pets:** id, household, name, photo (Supabase Storage, resized small), meal times (1 to 4 a day, default 7:30 AM and 6:00 PM), daily walk goal in minutes (default 60), sort order.
- **events:** id, household, pet, type (meal, walk, med), logged by, created at, meal slot (meals), appetite (meals only, optional: all, some, none), walk started and ended timestamps (walks), med (meds), optional note.
- **meds:** id, pet, name, schedule (daily at a set time for v1, but structured so every N days and monthly can be added later, since flea and heartworm meds are monthly), active flag.
- **push_tokens:** user, Expo push token, device label, created at. (Created now, used in the development build phase.)
- **notification_log:** what was sent and when, so reminders never double-send.
- **Undo** simply deletes the event.

## Core logic

Each of these is a pure TypeScript function shared by the app and the Edge Functions, with tests.

- **Meal status** for each slot:
  - **done** if a meal event exists for that slot today
  - **due** starting 2 hours before the slot time
  - **overdue** 30 minutes after the slot time with nothing logged
- A meal logged near a slot fills that slot. If someone logs a meal when every slot is already full, ask: "Milo already had 2 meals today. Log another anyway?" Preventing double feeding is the whole reason this app exists, so this warning matters everywhere, including the Shortcut and future widgets.
- "Today" uses the household's time zone and resets at local midnight.
- **Streak:** the number of consecutive days, ending yesterday (or today once today's meals are all done), where every meal slot was logged and none were overdue by more than 60 minutes. Today in progress never breaks the streak.
- **Care score:** a score out of 100 for the last 7 days, made of four sub-scores, each out of 100:
  - **Meals:** share of meal slots logged on time (within 30 minutes of the slot).
  - **Walks:** average of each day's walk minutes divided by the goal, capped at 100 per day.
  - **Meds:** share of scheduled doses logged. If the pet has no meds, drop this sub-score and reweight the rest.
  - **Routine:** how consistent meal times are day to day (low spread around each slot scores higher).
  - The overall score is a **weighted** average: meals 35%, meds 30%, walks 20%, routine 15%. Missed meals and meds affect the dog most, so they count more. Keep the weights in one config object so I can tune them.
  - The score is for the household and the pet, never a grade on one person. It only measures what's logged, so the app should say "based on what's been logged."

## Health (the main differentiator)

Pack's edge over other dog trackers is noticing when something's off. Keep it simple and honest.

- **Appetite tap:** right after a meal is logged, the Undo toast also shows three quick buttons: Ate all, Left some, Barely ate. Skipping is fine and stores nothing. It must never slow down logging a meal.
- **Trends** (pure functions with tests), over the last 14 days compared with the 14 before:
  - appetite per day (worst meal of the day counts)
  - average walk minutes per day and the change from the previous period
  - meds given vs scheduled
- **Alerts:** rare and only on clear patterns. v1 has one rule: "left some" or "barely ate" on 3 or more meals in the last 7 days, when the previous 7 days had at most 1. Show it as a Tangerine card on the Health screen (and as a notification in the development build phase), at most once a week per pet. Keep alert rules in one config file.
- **Wording:** never diagnose. Say "Milo's eating less than usual. Worth mentioning to your vet if it keeps up." Every Health screen and report shows "Based on what's been logged. Not medical advice."
- **Vet report:** a one-page PDF made on the phone with `expo-print` and shared with `expo-sharing` (confirm both work in Expo Go). Contents: pet name and photo, date range (default last 30 days), meals logged vs scheduled, the appetite chart, any alerts, walk minutes per day, meds with doses given vs scheduled, and notes from events. Clean and printable, in the app's colors on white. Pack Plus feature once payments exist.

## Design

Mockups are in the `design/` folder: `Main.dc.html` (Home), `Walk.dc.html`, `Setup.dc.html`, `History.dc.html`, `Health.dc.html` (trends and vet report), `Widgets.dc.html` (future widgets), and `Home-Lavender.dc.html`, `Home-Sky.dc.html`, `Home-Blush.dc.html` (alternate color themes). They're HTML design files: read the inline styles for exact colors, sizes, spacing and radii, and ignore the `support.js` script and `x-dc` wrapper tags. Use them as the visual reference and rebuild them as React Native components. Don't port the HTML. Screens are designed at 9:16 (405×720). Lay them out flexibly so they work on every iPhone size. There's no mockup for the Care screen yet; build it in the same style using the large care-score widget as the starting point.

**Home layout (Flo-style):** date and pet name with a pet switcher, a week strip (today filled, days with problems underlined in Tangerine), one big Green circle in the middle showing the next meal's status with the Feed button inside it, then two cards: Walks and Meds. Clean and simple: nothing else on Home.

**Palette** (light mode only for v1). Butter/Green is the default theme. Lavender, Sky and Blush (on the canvas) are optional themes for later; build colors as theme tokens so adding them is easy.

| Name | Hex | Use |
|---|---|---|
| Butter | `#FFEFB3` | App background, text and buttons on Green |
| Cream | `#FFF8DE` | Cards and list rows, with a hairline border of `rgba(1,62,55,0.08)` |
| Green | `#013E37` | Text, hero circle, tab bar, primary buttons |
| Muted green | `#4A6B65` | Secondary text on Butter and Cream |
| Muted on Green | `#B3BA8E` | Secondary text on Green |
| Tangerine | `#FF9F5A` | Alerts only: overdue states, the live dot, weakest care sub-score |
| Khaki | `#C9CBA6` | Past days in charts, empty bar tracks |

Text on Green is always Butter. Text on Tangerine is always Green.

**Type:** Urbanist (Google Fonts, SIL Open Font License), loaded with `expo-font` from files in the repo. Big numbers use weight 800, tight letter spacing and tabular figures.

**Shape and feel:** big rounded corners (cards 24pt, list rows 22pt, pills fully round), generous padding, one huge number as the focal point of each screen, and a floating Green pill tab bar with a large Butter center "+" button. Icon-only buttons need accessibility labels.

## Screens

1. **Sign in:** email, then a 6-digit code (Supabase email OTP).
2. **Onboarding:** create a household or join one with an invite code, add your dog (name, optional photo, meal times), then Setup.
3. **Setup** (mockup `Setup`): two steps with progress. Turn on reminders (local notifications in v1), and invite your household (show the invite code with a copy and share button). Reachable again from Settings.
4. **Home** (mockup `Main`): as described in Design. Updates live through Supabase Realtime when someone else logs something. While a walk is running, show "Milo is out with Victor · 12 min". After any log, show an Undo toast for 5 seconds.
5. **Walk** (mockup `Walk`): a big ring filling toward the walk goal, a timer computed from the server start time, start time, walker, goal, and an End walk button.
6. **Health** (mockup `Health`): the care score, the eating-less alert when there is one, the 14-day appetite chart, walk and meds trend cards, and a Create vet report button. A tab in the tab bar.
7. **Care** (new): the streak, the care score out of 100, and the four sub-scores with bars. The weakest sub-score is highlighted in Tangerine with one plain tip ("Two more walk-goal days this week gets Walks to 80"). Reached by tapping a streak pill on Home.
8. **History:** events grouped by day, filterable by pet and type. Days with extra meals are flagged.
9. **Household:** member list, invite code with share sheet, remove members, regenerate your shortcut code.
10. **Settings:** pets (edit, meal times, walk goal), meds, reminder preferences, plan and billing (hidden until the payments phase), setup again, sign out.

## One-tap logging with Apple Shortcuts (optional, until widgets exist)

- An Edge Function endpoint accepts a POST with the member's shortcut token as a Bearer token and a body like `{ "type": "meal" }` (also `"walk_start"` and `"walk_end"`, and an optional pet if the household has more than one). A meal goes into the next open slot. It returns one short line of text, like "Logged dinner for Milo."
- If every meal slot is already full, don't log. Return "Milo already had 2 meals today. Open Pack to log another."
- Validate input and rate-limit the endpoint.
- Give me exact steps to build the shortcut in the Shortcuts app (Get Contents of URL as a POST with the auth header, then Show Result), using an Import Question so each person pastes their own code. Keep this out of onboarding; it lives in Settings.

## Widgets (future: development build phase)

Designed on the canvas's Widgets board. Build these with Expo's widgets library (or `expo-apple-targets` if that's the better fit when we get there) on a development build. Widgets read the same Supabase data and write through the same Edge Functions as the Shortcut.

- **Streak (small):** days fed on time and this week's dots.
- **Meals (small):** meals fed today ("1/2") and an overdue tag.
- **Today (medium):** meal and walk status with **Fed** and **Start walk** buttons (interactive widgets, iOS 17+). The Fed button follows the same double-feeding rule as everywhere else.
- **Care score (large):** the score out of 100, the streak, and the four sub-score bars.
- **Lock Screen:** a circular care-score ring, a circular streak, and a rectangular dinner-status line.
- Later still: a Live Activity for a walk in progress.

## Notifications

- **v1 (Expo Go):** local scheduled reminders only, if Expo Go supports them (see the limits section). Meal reminder 30 minutes after a slot, cancelled when the app sees that slot logged. Med reminders at the scheduled time.
- **Development build phase:** Expo push notifications sent from a Supabase Edge Function.
  - "Sam fed Milo" to the rest of the household when someone logs. On by default, can be turned off.
  - Overdue reminders: a Supabase Cron job runs every 5 minutes, finds overdue meal slots in each household's time zone, and sends "Has anyone fed Milo?" once per slot (checked against notification_log). This job also keeps the free Supabase project from going idle, so set it up in Phase 1 even before it sends anything.
  - Delete push tokens that Expo reports as invalid.
  - Tapping a notification opens Pack to Home.

## Monetization (last phase, don't turn it on until I say)

- **Free:** one pet, solo use, meals, walks, the shortcut and reminders.
- **Pack Plus:** household sharing, unlimited pets, meds and reminders, full history, care score and widgets. Only the household owner pays. Invited members join free.
- $14.99 yearly subscription and a $24.99 one-time lifetime option.
- **Apple's rules apply.** A native iOS app selling digital features generally has to use Apple In-App Purchase, not Stripe Checkout. Check Apple's current rules (including any changes allowing links to outside payment in the US) and tell me the options before building. RevenueCat on a development build is the likely route. The household's plan is updated by a webhook handled by an Edge Function.
- During testing, use sandbox purchases only.

## Phases

0. **Setup, no features.** Walk me through creating the Supabase project, the Expo account and EAS project, the GitHub repo and secrets, and the CI workflow. Ship a bare app with the tab bar, theme tokens and Urbanist, and get it running on my phone in Expo Go. Don't start Phase 1 until I confirm.
1. Sign-in with email codes, households and invite codes, pets, meal logging, the Home screen with live updates and Undo, the meal-status logic with tests, and the Cron job (doing nothing yet besides staying alive).
2. Walks.
3. Setup screen, local reminders (if supported in Expo Go), History.
4. Health, streak and care score: the appetite tap, the trend and alert logic with tests, the Health screen, the vet report PDF, the Care screen, and the streak pill on Home.
5. Household, Settings, the Shortcuts endpoint and my step-by-step instructions, polish, and a placeholder app icon.
6. **Development build** (needs the Apple Developer Program; ask me first): EAS Build, install on my phone, push notifications, overdue and "Sam fed Milo" alerts.
7. Widgets from the Widgets board.
8. Payments, only when I say.

## Later

Android (Expo makes this mostly free, but widgets and payments differ), the alternate color themes, a walk Live Activity, and a weekly recap ("14/14 meals, 6.2 hours of walks"). Keep the backend clean and documented so every client (app, Shortcut, widgets) uses the same Supabase data and Edge Functions.

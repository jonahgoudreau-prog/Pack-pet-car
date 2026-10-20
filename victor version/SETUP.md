# Pack: phone setup (Phase 0)

Everything here works in Safari or apps on an iPhone. About 20 minutes total.

## How the app gets onto your phone

This cloud workspace can't run `npx expo start` for your phone (it also can't reach expo.dev at all). So:

1. Claude pushes code to GitHub.
2. GitHub Actions runs the checks, then publishes an **EAS Update** to the `preview` channel.
3. You open one saved link in Expo Go. It always loads the newest update.

## 1. Expo Go (2 min)

1. Install **Expo Go** from the App Store.
2. Open it once. The project uses **Expo SDK 57**, the version the App Store's Expo Go runs today.

> SDK 58 came out on Oct 15, 2026, and its Expo Go reaches the App Store "within a few weeks". That Expo Go will only run SDK 58 projects. When your Expo Go updates and Pack says the SDK isn't supported, tell Claude "upgrade to SDK 58". It's a small change.

## 2. Expo account and project (5 min)

1. In Safari go to **expo.dev/signup** and create an account. Remember your **username**.
2. Go to **expo.dev**, sign in, and tap **Create a project** (Projects page).
   - Display name: `Pack`
   - Slug: `pack` (must be exactly this)
3. On the project page, copy the **ID** (looks like `1a2b3c4d-...`). This is your **project ID**. It isn't secret.
4. Make an access token: tap your avatar → **Account settings** → **Access tokens** → **Create token**. Name it `github-actions`, copy the token. It's shown only once. **This one is secret.** Never paste it in chat.

Tip: if a page looks cramped, tap **aA** in Safari's address bar → **Request Desktop Website**.

## 3. GitHub secrets and variables (5 min)

You need admin access to the repo for this. If you don't see **Settings** on the repo page, ask the repo owner to do these steps or to make you an admin.

1. In Safari, open the repo on github.com. Switch to the desktop site (**aA** → **Request Desktop Website**).
2. **Settings** → **Secrets and variables** → **Actions**.
3. **Secrets** tab → **New repository secret**:
   - Name `EXPO_TOKEN`, value: the access token from step 2.4.
4. **Variables** tab → **New repository variable**, twice:
   - Name `EAS_PROJECT_ID`, value: the project ID from step 2.3.
   - Name `EXPO_OWNER`, value: your Expo username.

## 4. Publish and open (3 min)

1. On the repo: **Actions** → **Pack app** → the newest run on `victor-version` → **Re-run all jobs**. (Any new push also does this.)
2. Wait for both jobs to turn green (about 3–5 minutes).
3. Open the run's **Summary**. Under **Open Pack in Expo Go** there's a link starting with `exp://`. Long-press it, copy it.
4. Paste it into Safari's address bar and tap **Go**. Safari asks to open it in Expo Go. Tap **Open**.
5. Next time, just open Expo Go: Pack is in the recently opened list and fetches the newest version on launch. If it ever looks stale, close Expo Go fully and reopen.

## 5. Supabase project (5 min; used from Phase 1)

1. In Safari go to **supabase.com** → **Start your project** → sign up (GitHub sign-in is easiest).
2. **New project**: name `pack`, generate a database password and save it in your password manager, pick the region closest to you, **Free** plan. Create.
3. Leave it there. In Phase 1 Claude will tell you exactly which values to copy and where:
   - Project URL and publishable (anon) key → GitHub **variables** (they're public by design).
   - A Supabase access token and the database password → GitHub **secrets**, so GitHub can apply database changes for you.

> **Heads-up for Phase 1:** Supabase's built-in email only sends sign-in codes to members of your Supabase team, and only 2 emails an hour. You can sign in, but Sam and others won't get codes until we connect a free email sender (e.g. Brevo). Claude will walk you through it in Phase 1.

## Where each key goes

| Key | Where | Secret? |
|---|---|---|
| `EXPO_TOKEN` | GitHub → Actions **secret** | Yes |
| `EAS_PROJECT_ID` | GitHub → Actions **variable** | No |
| `EXPO_OWNER` | GitHub → Actions **variable** | No |
| Supabase URL + anon key | GitHub variables (Phase 1) | No |
| Supabase access token, DB password | GitHub secrets (Phase 1) | Yes |

Nothing secret is ever committed to the repo.

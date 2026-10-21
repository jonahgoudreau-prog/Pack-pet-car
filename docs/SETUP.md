# Phase 0 setup, from an iPhone

About 30 minutes. Everything here works in Safari on an iPhone. Do the steps in order: GitHub needs the Supabase values before the merge in step 3, and Cloudflare deploys from `main`.

**Two Safari tabs help:** keep Supabase open in one and GitHub or Cloudflare in the other, and paste each value as soon as you copy it.

**Don't paste any of these values into the Claude chat.** The project URL and publishable key aren't secret, but the rest are.

## What goes where

| Value                                    | Where you get it (Supabase)                          | Where it goes                                                        | Secret?                          |
| ---------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------- |
| Project URL `https://<ref>.supabase.co`  | Connect button, or Project Settings → Data API       | Cloudflare **build variable** `VITE_SUPABASE_URL`                    | No                               |
| Publishable key `sb_publishable_…`       | Connect button, or Project Settings → API Keys       | Cloudflare **build variable** `VITE_SUPABASE_PUBLISHABLE_KEY`        | No, it's built to be public      |
| Project ID (the `<ref>` part of the URL) | The 20 letters between `https://` and `.supabase.co` | GitHub Actions **variable** `SUPABASE_PROJECT_ID`                    | No                               |
| Database password                        | You create it with the project                       | GitHub Actions **secret** `SUPABASE_DB_PASSWORD`, plus Passwords app | **Yes**                          |
| Access token `sbp_…`                     | Account → Access Tokens                              | GitHub Actions **secret** `SUPABASE_ACCESS_TOKEN`                    | **Yes**                          |
| Secret key `sb_secret_…`                 | Leave it alone                                       | Nowhere. Edge Functions get it automatically.                        | **Yes**, never put it in the app |

The publishable key is safe to ship in the app. Row Level Security (coming in Phase 1) is what keeps each household's data private.

## 1. Create the Supabase project

1. In Safari, go to **supabase.com** and tap **Start your project**. Sign in with **Continue with GitHub** and approve.
2. If it asks you to create an organization: name it `Pack`, type **Personal**, plan **Free**, then **Create organization**.
3. On **Create a new project**:
   - **Name:** `pack`
   - **Database password:** tap **Generate a password**, copy it, and save it in the **Passwords** app right away (tap **+**, website `supabase.com`, user name `pack database`). You need it in step 2.
   - **Region:** the one closest to you.
   - Leave everything else (security and Data API options) at the defaults.
   - Tap **Create new project** and wait a minute or two.
4. When the project is ready, tap **Connect** at the top of the project page. Copy the **Project URL** and the **Publishable key** (`sb_publishable_…`) somewhere temporary, like a Note you delete later. If you can't find Connect, open the menu (☰) → **Project Settings**: the key is under **API Keys** and the URL under **Data API**.
5. Your **Project ID** is the middle part of the Project URL: for `https://abcdefghijklmnopqrst.supabase.co` it's `abcdefghijklmnopqrst`.
6. Create an access token so GitHub can update the database. Go to **supabase.com/dashboard/account/tokens**, tap **Generate new token**, name it `github-actions`, choose the longest expiry offered, and tap **Generate token**. **Copy it now**, because it's only shown once. Keep this tab open for step 2.

## 2. Add the Supabase values to GitHub

These let GitHub Actions apply database changes when code lands on `main`, so you never need a laptop for migrations.

1. In a new Safari tab, open **github.com/jonahgoudreau-prog/Pack-pet-care/settings/secrets/actions**. If GitHub's mobile layout won't show it, switch to the desktop site: open Safari's page menu (the icon at the left of the address bar, or **•••** on iOS 26) and tap **Request Desktop Website**.
2. On the **Secrets** tab, tap **New repository secret** twice:
   - Name `SUPABASE_ACCESS_TOKEN`, secret: the `sbp_…` token. Tap **Add secret**.
   - Name `SUPABASE_DB_PASSWORD`, secret: the database password from the Passwords app. Tap **Add secret**.
3. Switch to the **Variables** tab and tap **New repository variable**:
   - Name `SUPABASE_PROJECT_ID`, value: the Project ID. Tap **Add variable**.

## 3. Merge the Phase 0 branch into `main`

Cloudflare deploys whatever is on `main`, so the code needs to be there first.

1. Open **github.com/jonahgoudreau-prog/Pack-pet-care**. Tap **Compare & pull request** on the yellow banner for `claude/new-session-890maj`. If there's no banner, go to **Pull requests → New pull request**, pick base `main` and compare `claude/new-session-890maj`. (You can also ask Claude to open the pull request.)
2. Tap **Create pull request**. Wait for the **CI** check to turn green, then tap **Merge pull request → Confirm merge**.
3. Open the **Actions** tab. Within about two minutes, **CI** and **Deploy Supabase** should both be green. If **Deploy Supabase** is red, open it and read the failed step. It's almost always a typo in one of the three values from step 2. Fix the value, then tap **Re-run jobs**.

## 4. Deploy to Cloudflare

1. In Safari, go to **dash.cloudflare.com/sign-up**, create a free account, and verify your email. If it offers to add a domain, skip it.
2. Open **Workers & Pages**. On a phone it's in the menu (☰), sometimes under **Compute**. You can also go straight to **dash.cloudflare.com/?to=/:account/workers-and-pages**.
3. Tap **Create application**, then **GitHub**. Approve the **Cloudflare Workers and Pages** GitHub app. Choose **Only select repositories → Pack-pet-care**, then **Install & Authorize**.
4. Pick **Pack-pet-care** from the list and fill in:
   - **Project name:** `pack`, exactly. It has to match `wrangler.jsonc`, or the build fails.
   - **Build command:** `npm run build`
   - **Deploy command:** leave the default, `npx wrangler deploy`.
   - Under **Advanced settings → Build variables**, add two variables:
     - `VITE_SUPABASE_URL` = your Project URL
     - `VITE_SUPABASE_PUBLISHABLE_KEY` = your publishable key
5. Tap **Save and Deploy**. If it asks you to pick a `workers.dev` subdomain first, choose something short. Your app will live at `https://pack.<subdomain>.workers.dev`.
6. **If you didn't see Build variables** while creating it, add them afterwards: open the Worker → **Settings → Build → Build variables and secrets**. They must go there and **not** under **Settings → Variables & Secrets**, which are runtime-only and invisible to the build. Then go to **Deployments → View build history**, open the latest build, and tap **Retry build**.
7. Open **Settings → Build → Branch control**. Check that the production branch is `main` and **Enable Preview Builds** is on. Every branch Claude pushes then gets its own preview link, posted on its pull request and listed under the Worker's **Previews**.

## 5. Test on your iPhone

1. In Safari, open `https://pack.<subdomain>.workers.dev`. You should see the Pack shell on a Butter background with **2 of 3 done**: "Works offline" and "Connected to Supabase" ticked, and "Add to Home Screen" still to do. If Supabase shows an error, the build variables are wrong (step 4.6).
2. Add it to your Home Screen:
   - **iOS 26 and later:** tap **•••** (bottom right) → **Share** → **View More** if needed → **Add to Home Screen**. Make sure **Open as Web App** is on, then tap **Add**.
   - **iOS 18:** tap the **Share** button → **Add to Home Screen** → **Add**.
3. The icon should be a green square with a butter paw, named **Pack**.
4. Open Pack from the Home Screen. It should fill the screen with no Safari address bar, and show **3 of 3 done** and **Pack is ready to build on**.
5. Offline test: turn on Airplane Mode, swipe Pack away in the app switcher, and open it again. It should still open. "Connected to Supabase" will show an error, which is expected offline. Turn Airplane Mode off.
6. The line at the bottom (`Build 1a2b3c4 · main · …`) should match the latest commit on `main` in GitHub. **Check for update** fetches a new deploy if there is one, and Pack reloads itself.

Then tell Claude what you saw (a screenshot is perfect) and your `workers.dev` URL, which isn't secret.

## Day to day

- **Production** is `main`. Every merge to `main` deploys to `pack.<subdomain>.workers.dev` in a minute or two. Pack checks for a new version whenever you bring it to the foreground and reloads itself.
- **Previews:** each other branch gets its own URL. A preview installed to the Home Screen is a separate app with separate storage and notifications, so use the production one day to day.
- **Database changes** ship from `supabase/migrations/` via the **Deploy Supabase** action when they land on `main`.

# Setting up Daybloom

Daybloom runs in two modes:

- **Demo mode** (no setup): accounts and data live in the visitor's browser. Good for trying the app and for a first Netlify deploy.
- **Live mode** (Supabase): real accounts, social logins, data synced across devices, and following friends.

The app switches to live mode automatically when two environment variables are set.

In both modes, visitors can use the planner, workouts and food log as **guests** without signing up. Guest entries stay in their browser and move into their account when they create one. Friends, sharing and the profile page need a (free) account.

---

## 1. Deploy to Netlify

The repo already contains `netlify.toml` (build command, publish folder, single-page-app redirect).

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project → GitHub**, then pick this repo and branch.
3. Netlify reads the settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy**. The site works right away in demo mode.

Or from your computer, with the Netlify CLI:

```bash
npm install
npm run build
npx netlify-cli deploy --prod --dir=dist
```

## 2. Turn on real accounts with Supabase (free tier is fine)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and click **Run**. This creates the tables and the privacy rules:
   - The planner, food diary, water and mood are private to each person.
   - Workouts are visible to followers only when "Share with my followers" is ticked.
3. In **Project Settings → API**, copy the **Project URL** and the **anon public** key.
4. In Netlify: **Site configuration → Environment variables**, add:
   - `VITE_SUPABASE_URL` = the Project URL
   - `VITE_SUPABASE_ANON_KEY` = the anon public key
5. In Supabase: **Authentication → URL Configuration**:
   - **Site URL**: your Netlify address, e.g. `https://daybloom.netlify.app`
   - **Redirect URLs**: add `https://daybloom.netlify.app/**` (and `http://localhost:5173/**` for local development)
6. In Netlify, **Deploys → Trigger deploy** so the new variables are built in.

The anon key is designed to be public. Your data is protected by the row-level security rules in `schema.sql`. Never put the `service_role` key in Netlify or in the app.

## 3. Social logins

Each provider is switched on in Supabase under **Authentication → Sign In / Providers**. Every provider asks for the same callback URL, which Supabase shows on that screen:

```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

Here's what you need to create for each one. **These are the steps only you can do, because they need your own developer accounts:**

| Provider | What you need to create | Notes |
|---|---|---|
| **Google** | An OAuth client (type "Web application") in Google Cloud Console → APIs & Services → Credentials, plus the OAuth consent screen | Paste the Client ID and Secret into Supabase. |
| **Facebook** | A Meta app (type "Consumer") at developers.facebook.com with Facebook Login | Paste the App ID and Secret. To let the public sign in, the app must be switched to **Live** mode, and Meta requires Business Verification for advanced access to email. |
| **X (Twitter)** | An app in the X Developer Portal with "Request email from users" turned on | The app uses Supabase's `twitter` provider. Supabase also added a newer X (OAuth 2.0) provider in 2026; to use it, change `'twitter'` to `'x'` in `src/pages/AuthPage.tsx` and `src/pages/ProfilePage.tsx` and update `@supabase/supabase-js`. |
| **Apple** | A paid Apple Developer account, a Services ID, and a signing key (.p8) | The client secret expires every **6 months**. Set a reminder to regenerate it, or Apple sign-in stops working. |
| **Instagram** | Not possible | Meta shut down Instagram login for personal accounts in December 2024. The replacement only works for Business and Creator accounts. Daybloom lets people **share** to Instagram instead: it copies the post text, and on phones it opens the system share sheet. |
| **TikTok** | Not built into Supabase | Could be added later through Supabase custom OAuth providers. It needs a TikTok developer app and review. |

Providers you don't set up show an error if someone taps them. Remove any you don't plan to use from the `PROVIDERS` list in `src/pages/AuthPage.tsx` and the `CONNECTIONS` list in `src/pages/ProfilePage.tsx`.

### Sharing to social apps

Share buttons for X, Facebook, Threads and WhatsApp use each network's public share links. They need no keys or setup.

## 4. Run it locally

```bash
npm install
cp .env.example .env.local   # optional: fill in Supabase keys
npm run dev                  # http://localhost:5173
```

Leave `.env.local` empty to run in demo mode.

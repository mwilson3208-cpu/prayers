# Closer to the Father

A free prayer community where anyone can submit a prayer request, pray for others, and give thanks to God for answered prayers. It is the online home of the [Closer to the Father YouTube channel](https://www.youtube.com/channel/UC5INMtGtvbf34D7gkYbbmBQ).

**You were never meant to carry it alone.**

The site runs entirely on free plans: Vercel (hosting), Supabase (database), Cloudflare Turnstile (spam protection), and Resend (email, optional). No ads, no paid APIs.

---

## What is included

| Page | Address | What it does |
| --- | --- | --- |
| Home | `/` | Hero, three main buttons, latest YouTube video, live counters, Scripture of the day, Pray With Us Daily |
| Submit a Prayer | `/submit` | Prayer request form with crisis notice (988), public or private |
| Prayer Wall | `/prayer-wall` | Approved public requests, category filter, "I prayed for this," template prayer, share buttons |
| Single request | `/prayer-wall/[id]` | Shareable page for one request |
| Answered Prayers | `/answered` | Testimony form and "Praise God" wall |
| Scripture | `/scripture` | Verses by need, how to pray each one, first-time prayer |
| Watch | `/watch` | Channel uploads playlist and subscribe button |
| About | `/about` | Mission, statement of faith, contact form |
| 7-Day Prayer Guide | `/7days` | Landing page for the free PDF guide (share this link). After signing up, visitors go to `/guide/thank-you` to download it and are invited to the YouTube channel. The old `/guide` address redirects here. |
| Privacy, Terms | `/privacy`, `/terms` | Plain-English policies |
| Admin | `/admin` | Password-protected moderation dashboard |

Also included: SEO metadata, Open Graph share image, `sitemap.xml`, `robots.txt`, installable PWA (add to home screen), light and dark mode (dark by default), and an offline page.

---

## Step-by-step setup (no coding needed)

Plan on about 45 minutes the first time. You will create four free accounts: GitHub, Supabase, Vercel, and Cloudflare. Resend is optional.

### Step 1. Put the code on GitHub

If you are reading this on GitHub, this step is done. Otherwise create a free account at [github.com](https://github.com) and upload this folder as a new repository.

### Step 2. Create the database (Supabase)

1. Go to [supabase.com](https://supabase.com) and sign up (free).
2. Click **New project**. Name it `closer-to-the-father`. Choose a strong database password and save it somewhere safe. Pick the region closest to most of your visitors. Click **Create**.
3. Wait about two minutes while it sets up.
4. In the left menu, click **SQL Editor**, then **New query**.
5. Open the file [`supabase/schema.sql`](supabase/schema.sql) in this project, copy everything, paste it into the editor, and click **Run**. You should see "Success."
6. Optional sample data: open [`supabase/seed.sql`](supabase/seed.sql), copy, paste into a new query, and click **Run**. This adds 12 sample prayers and 5 answered prayers so the site does not look empty. You can delete them later from the admin dashboard.
7. In the left menu, click **Project Settings**, then **API**. Keep this page open. You need:
   - **Project URL** (looks like `https://abcd1234.supabase.co`)
   - **service_role** key (click Reveal). This is a secret. Never post it anywhere.

### Step 3. Set up spam protection (Cloudflare Turnstile)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign up (free).
2. In the left menu, click **Turnstile**, then **Add widget**.
3. Name it `Closer to the Father`. Under hostnames, add your domain (for example `closertothefather.com`) and also `vercel.app`. Choose **Managed** mode. Click **Create**.
4. Copy the **Site Key** and the **Secret Key**.

### Step 4. Set up email (Resend, optional but recommended)

Without this step the site still works, but no emails are sent.

1. Go to [resend.com](https://resend.com) and sign up (free: 3,000 emails a month).
2. Click **Domains**, then **Add Domain**, and follow the steps to verify your domain. This means adding a few records where you bought your domain (GoDaddy, Namecheap, Cloudflare, and so on). Resend shows you exactly what to paste.
3. Click **API Keys**, then **Create API Key**. Copy it.

### Step 5. Put the site online (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account (free Hobby plan).
2. Click **Add New**, then **Project**, and import this repository.
3. Before clicking Deploy, open **Environment Variables** and add each of these. The full list with explanations is in [`.env.example`](.env.example).

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Your site address, like `https://closertothefather.com` (no slash at the end) |
| `SUPABASE_URL` | Project URL from Step 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key from Step 2 |
| `ADMIN_PASSWORD` | The password you will use at `/admin` (12 or more characters) |
| `ADMIN_SESSION_SECRET` | A long random string (see below) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Site Key from Step 3 |
| `TURNSTILE_SECRET_KEY` | Secret Key from Step 3 |
| `RESEND_API_KEY` | API key from Step 4 (optional) |
| `EMAIL_FROM` | For example `Closer to the Father <prayer@closertothefather.com>` |
| `ADMIN_EMAIL` | Your email, for new-submission alerts |
| `CRON_SECRET` | Another long random string |
| `HASH_SALT` | Another long random string (optional) |

   For the random strings, open [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32) and copy what it shows. Refresh for a new one each time.

4. Click **Deploy**. In about two minutes your site is live at an address like `closer-to-the-father.vercel.app`.

### Step 6. Connect your domain

In Vercel, open your project, click **Settings**, then **Domains**, and add your domain. Vercel shows the records to add where you bought the domain. Once it is connected, make sure `NEXT_PUBLIC_SITE_URL` matches it, then click **Deployments**, the three dots on the latest one, and **Redeploy**.

### Step 7. Fill in your YouTube links

Open [`content/site.json`](content/site.json) on GitHub and click the pencil icon to edit. Fill in:

- `startHereVideoId`: the ID of your "Start Here" video. In `https://www.youtube.com/watch?v=AbC123xyz`, the ID is `AbC123xyz`.
- `firstPrayerVideoId`: the video that walks someone through praying for the first time.
- `morningPlaylistId` and `nightPlaylistId`: in `https://www.youtube.com/playlist?list=PLxxxx`, the ID is `PLxxxx`.
- `social`: add your other social links, for example `{ "label": "Instagram", "url": "https://instagram.com/yourhandle" }`.

Click **Commit changes**. Vercel redeploys automatically in about a minute. Until these are filled in, those buttons link to your channel or its playlists page, so nothing is ever broken.

### Step 8. Test it

On your phone, submit a test prayer, then go to `/admin`, sign in, and approve it. Check that it appears on the prayer wall and that you received the admin alert email.

---

## Editing content without touching code

All of the words most likely to change live in the `content/` folder. Edit them on GitHub with the pencil icon and commit. The site updates in about a minute.

| File | What is in it |
| --- | --- |
| `content/scripture.json` | Every verse on the site: page verses, 62 daily verses, the 10 needs on the Scripture page, and the first-time prayer |
| `content/site.json` | Name, tagline, mission, YouTube IDs, social links, About page text, statement of faith, and `notifications.guideSignupAlertTo` (who gets an email each time someone signs up for the 7-Day Prayer Guide; separate several addresses with commas) |
| `content/guide.json` | Title, day list, and file path of the 7-Day Prayer Guide. To replace the PDF, upload a new file to `public/downloads/` with the same name. |
| `content/seed-data.json` | Sample prayers (used for demo mode and `supabase/seed.sql`) |

Tip: JSON is picky. Keep the quotation marks and commas exactly as they are, and if you need a quote mark inside text, type `\"`. If a change breaks the site, Vercel keeps the previous version online and shows the error in the Deployments tab.

Scripture is quoted from the ESV. The ESV allows up to 1,000 verses on a site without written permission, as long as the copyright notice appears (it is in the footer).

---

## How it works

- **Moderation.** Public prayer requests go on the prayer wall right away unless a filter flags them (possible crisis, profanity, or contact details), which wait for your approval. Answered prayers on Give Thanks work the same way. Turn either off with `moderation.autoApprovePrayers` or `moderation.autoApproveTestimonies` in `content/site.json`. Private requests go to the admin dashboard only and are never shown publicly.
- **Spam filtering.** Before anything reaches your queue: a hidden trap field catches bots, Turnstile checks for a human, each visitor is limited to 5 prayers and 5 testimonies an hour, links are blocked, and common spam phrases (casinos, crypto schemes, "spell casters") are rejected. Profanity is masked with asterisks and the item is flagged.
- **Crisis care.** If a request mentions self-harm or danger, the Submit page shows a gentle notice with the 988 Suicide and Crisis Lifeline right away, the item is flagged "Urgent" in the dashboard, and the admin alert email is marked urgent.
- **"I prayed for this."** One tap per device per request per day. The phone remembers it, and the server checks too, so clearing the browser does not allow repeats.
- **Privacy.** Emails live in a separate table the public can never read. IP addresses are never stored, only a one-way scrambled code.
- **Emails.** Confirmation when someone submits with an email, a weekly "people prayed for you" note on Mondays (only if someone prayed that week), a welcome email with the 7-Day Prayer Guide, and admin alerts. Every email to visitors has an unsubscribe link.
- **Daily job.** Vercel calls `/api/cron/daily` once a day. It cleans up old data, sends the Monday notes, and keeps the free Supabase project from pausing for inactivity.

### Security model

The browser never talks to the database. All reads and writes go through the site's server using the `service_role` key, which stays secret on Vercel. Row-level security is switched on for every table as a second lock: with the public key, someone could only read approved public prayers and testimonies, and only the safe columns (no emails, no IP codes, no private requests). They cannot write anything. This was tested against PostgreSQL 16 with Supabase's roles.

---

## For developers

```bash
npm install
cp .env.example .env.local   # leave Supabase empty to run in demo mode
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
npm run typecheck
npm run seed:sql             # rebuild supabase/seed.sql from content/seed-data.json
npm run icons                # re-render PNG icons from public/icons/icon.svg
```

**Demo mode.** If `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is empty, the site uses an in-memory store loaded with the sample data, shows a banner, and the admin password is `demo` (unless `ADMIN_PASSWORD` is set). Nothing is saved. Use it for previews and testing only.

**Stack.** Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, `@supabase/supabase-js`. No other runtime dependencies. Email is sent with a plain `fetch` to Resend's API.

**Layout.**

```
content/            editable JSON (scripture, site text, guide, sample data)
supabase/           schema.sql (tables, RLS, functions) and seed.sql
src/app/            pages, API routes (src/app/api), admin (src/app/admin)
src/components/     UI components
src/lib/store/      data layer: supabase.ts (live) and memory.ts (demo)
src/lib/            moderation, crisis detection, email, auth, helpers
public/             icons, service worker, offline page
```

**Free-tier limits to know.** Supabase free: 500 MB database (hundreds of thousands of prayers), projects pause after 7 days with no activity (the daily job prevents this). Vercel Hobby: generous bandwidth, one daily cron. Resend free: 3,000 emails a month, 100 a day. If the site grows beyond these, each service has an inexpensive paid tier, and no code changes are needed.

See [ADMIN_GUIDE.md](ADMIN_GUIDE.md) for day-to-day moderation.

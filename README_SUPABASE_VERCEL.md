# Supabase (Vercel) Environment Variable Setup

This project’s static pages in `/public` load Supabase in the browser via:
- `public/supabase-browser.js`
- `public/script.js`

That browser file expects the values to be injected into `window.__SUPABASE_ENV__` by Next’s `app/layout.tsx` and `app/layout.js`.

## Required Environment Variables
Set these in your deployment or local env file:

- `VITE_SUPABASE_URL` = `https://<project-ref>.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = your Supabase **anon/public** key

### Notes
- The `VITE_` prefix is used in this project’s browser bootstrap.
- Do **not** put service-role keys in the browser.

## Redeploy Instructions (required)
1. Add/update the env vars in your deployment environment.
2. Trigger a deployment.
3. After deployment finishes, hard-refresh the browser:
   - desktop: `Ctrl+Shift+R`
   - mobile: pull-to-refresh + clear cache if needed

## Troubleshooting
- If you see: **“Supabase env vars missing”** or **“Supabase client not ready”**
  - confirm both env vars are set in your deployment or local `.env.local`
  - confirm you used the correct project’s Supabase URL/key
- Open DevTools Console and check for the explicit missing-var list.

## Appointment Inserts
The frontend inserts into the Supabase table `public.appointments`.
Make sure your `appointments` table schema matches the keys used in `public/script.js`.
See `SUPABASE_APPOINTMENTS_SQL.md` for the expected columns.


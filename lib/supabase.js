import { createClient } from '@supabase/supabase-js';

// Client-side Supabase helper.
// IMPORTANT: this file is for the browser/static usage, so it uses NEXT_PUBLIC_* env vars.
// Vercel requirement: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Project > Environment Variables.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Keep the message explicit for production troubleshooting.
  console.warn(
    '[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. '
      + 'Supabase calls will fail.'
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: { persistSession: false },
    // Realtime requires websockets; defaults are fine.
  }
);


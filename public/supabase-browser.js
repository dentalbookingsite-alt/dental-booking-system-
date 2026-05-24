import { createClient } from '@supabase/supabase-js';

const runtimeEnv =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : {};

let supabase = null;

window.supabase = null;
window.supabaseReady = false;
window.__SUPABASE_BROWSER_STATUS__ = 'loading';

async function resolveSupabaseEnv() {
  const injectedEnv = window.__SUPABASE_ENV__ || {};

  const url =
    runtimeEnv.VITE_SUPABASE_URL ||
    injectedEnv.url ||
    '';
  const anonKey =
    runtimeEnv.VITE_SUPABASE_ANON_KEY ||
    injectedEnv.anonKey ||
    '';

  if (!url || !anonKey) {
    console.error('[supabase-browser] Missing Supabase environment variables.');
    return { url: '', anonKey: '' };
  }

  return { url, anonKey };
}

async function initializeSupabase() {
  const { url, anonKey } = await resolveSupabaseEnv();

  if (!url || !anonKey) {
    console.error('Supabase environment variables are missing.');
    window.supabase = null;
    window.supabaseReady = false;
    window.__SUPABASE_BROWSER_STATUS__ = 'missing-env';
    return;
  }

  supabase = createClient(url, anonKey, {
    auth: {
      persistSession: false,
    },
  });

  window.supabase = supabase;
  window.supabaseReady = true;
  window.__SUPABASE_BROWSER_STATUS__ = 'ready';
  console.log('Supabase initialized successfully.');
}

initializeSupabase();

export default supabase;



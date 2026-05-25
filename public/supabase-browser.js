import { createClient } from '@supabase/supabase-js';

function normalizeSupabaseUrl(value) {
  if (!value) return '';

  const trimmed = String(value).trim().replace(/\/+$/, '');
  if (!trimmed) return '';

  if (trimmed.endsWith('/rest/v1')) {
    return trimmed.slice(0, -'/rest/v1'.length);
  }

  if (trimmed.endsWith('/rest/v1/')) {
    return trimmed.slice(0, -'/rest/v1/'.length);
  }

  return trimmed;
}

function getInjectedEnv() {
  const injected = window.__SUPABASE_ENV__;

  if (!injected || typeof injected !== 'object') {
    return null;
  }

  const url = normalizeSupabaseUrl(injected.url || '');
  const anonKey = typeof injected.anonKey === 'string' ? injected.anonKey.trim() : '';

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

async function initSupabase() {
  const env = getInjectedEnv();

  if (!env || !env.url || !env.anonKey) {
    window.__SUPABASE_BROWSER_STATUS__ = 'missing-env';
    window.supabase = null;
    window.supabaseReady = false;
    console.error(
      '[supabase-browser] Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in Vercel AND you redeployed.'
    );
    return;
  }


  const supabaseClient = createClient(env.url, env.anonKey);
  window.supabase = supabaseClient;
  window.supabaseReady = true;
  window.__SUPABASE_BROWSER_STATUS__ = 'ready';
  console.log('[supabase-browser] Supabase initialized.');
}

let supabase = null;
window.supabase = null;
window.supabaseReady = false;
window.__SUPABASE_BROWSER_STATUS__ = 'loading';

initSupabase().catch((error) => {
  console.error('[supabase-browser] Failed to initialize Supabase client.', error);
  window.supabase = null;
  window.supabaseReady = false;
  window.__SUPABASE_BROWSER_STATUS__ = 'init-failed';
});

export default supabase;


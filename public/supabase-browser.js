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

function readInjectedSupabaseEnv() {
  const injected = window.__SUPABASE_ENV__;
  if (!injected) {
    return null;
  }

  const url = normalizeSupabaseUrl(injected.url || '');
  const anonKey = typeof injected.anonKey === 'string' ? injected.anonKey.trim() : '';

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

async function fetchSupabaseEnv() {
  try {
    const response = await fetch('/api/supabase-env', {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const url = normalizeSupabaseUrl(payload?.url || '');
    const anonKey = typeof payload?.anonKey === 'string' ? payload.anonKey.trim() : '';

    if (!url || !anonKey) {
      return null;
    }

    return { url, anonKey };
  } catch (error) {
    console.warn('[supabase-browser] Failed to fetch Supabase env from /api/supabase-env.', error);
    return null;
  }
}

async function bootstrapSupabase() {
  const injectedEnv = readInjectedSupabaseEnv();
  const env = injectedEnv || (await fetchSupabaseEnv());

  console.log('[supabase-browser] Injected env exists:', !!injectedEnv);
  console.log('[supabase-browser] Supabase env resolved:', !!env);

  if (!env || !env.url || !env.anonKey) {
    window.supabase = null;
    window.supabaseReady = false;
    window.__SUPABASE_BROWSER_STATUS__ = 'missing-env';
    console.error('[supabase-browser] Missing Supabase environment variables.');
    return;
  }

  const supabaseClient = createClient(env.url, env.anonKey);
  supabase = supabaseClient;
  window.supabase = supabaseClient;
  window.supabaseReady = true;
  window.__SUPABASE_BROWSER_STATUS__ = 'ready';
  console.log('[supabase-browser] Supabase initialized.');
}

let supabase = null;
window.supabase = null;
window.supabaseReady = false;
window.__SUPABASE_BROWSER_STATUS__ = 'loading';

bootstrapSupabase().catch((error) => {
  console.error('[supabase-browser] Failed to initialize Supabase client.', error);
  window.supabase = null;
  window.supabaseReady = false;
  window.__SUPABASE_BROWSER_STATUS__ = 'init-failed';
});

export default supabase;
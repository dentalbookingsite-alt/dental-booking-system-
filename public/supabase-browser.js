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

async function fetchEnvFromApi() {
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
}

async function initSupabase() {
  const injectedEnv = getInjectedEnv();
  const env = injectedEnv || (await fetchEnvFromApi());

  if (!env || !env.url || !env.anonKey) {
    window.__SUPABASE_BROWSER_STATUS__ = 'missing-env';
    window.supabase = null;
    window.supabaseReady = false;
    console.error('[supabase-browser] Missing Supabase environment variables.');
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
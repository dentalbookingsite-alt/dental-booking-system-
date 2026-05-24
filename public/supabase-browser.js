/* global window */

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

async function loadSupabaseEnv() {
  const injectedEnv =
    typeof window !== 'undefined' && window.__SUPABASE_ENV__
      ? window.__SUPABASE_ENV__
      : {};

  const normalizedInjected = {
    url: normalizeSupabaseUrl(injectedEnv.url),
    anonKey: injectedEnv.anonKey || '',
  };

  if (normalizedInjected.url && normalizedInjected.anonKey) {
    window.__SUPABASE_ENV__ = normalizedInjected;
    return normalizedInjected;
  }

  try {
    const response = await fetch('/api/supabase-env', { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) {
      return {};
    }

    const normalized = {
      url: normalizeSupabaseUrl(data.url),
      anonKey: data.anonKey || '',
    };

    if (normalized.url && normalized.anonKey) {
      window.__SUPABASE_ENV__ = normalized;
      return normalized;
    }

    return {};
  } catch (error) {
    console.error('[supabase-browser] Failed to fetch Supabase env from /api/supabase-env:', error);
    return {};
  }
}

async function initSupabaseBrowser() {
  if (window.__SUPABASE_BROWSER_INIT__) return;
  window.__SUPABASE_BROWSER_INIT__ = true;

  const env = await loadSupabaseEnv();
  const url = normalizeSupabaseUrl(env && env.url);
  const anonKey = env && env.anonKey;

  const missing = [];
  if (!url) missing.push('VITE_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL');
  if (!anonKey) missing.push('VITE_SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (missing.length) {
    console.error(
      `[supabase-browser] Supabase env vars missing: ${missing.join(', ')}. ` +
        'Set them in your deployment environment or local .env.local file and restart the dev server.'
    );
    window.supabase = null;
    return;
  }

  const script = document.createElement('script');
  script.src =
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
  script.async = true;

  script.onload = function () {
    try {
      if (!window.supabase || typeof window.supabase.createClient !== 'function') {
        console.error('[supabase-browser] supabase global missing after CDN load');
        window.supabase = null;
        return;
      }

      window.supabase = window.supabase.createClient(url, anonKey, {
        auth: { persistSession: false },
      });

      console.log('[supabase-browser] Supabase client ready');
    } catch (e) {
      console.error('[supabase-browser] Failed to initialize Supabase client:', e);
      window.supabase = null;
    }
  };

  script.onerror = function (e) {
    console.error('[supabase-browser] Failed to load supabase-js bundle:', e);
    window.supabase = null;
  };

  document.head.appendChild(script);
}

initSupabaseBrowser();



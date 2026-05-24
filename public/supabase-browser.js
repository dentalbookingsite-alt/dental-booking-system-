/* global window */

async function loadSupabaseEnv() {
  const injectedEnv =
    typeof window !== 'undefined' && window.__SUPABASE_ENV__
      ? window.__SUPABASE_ENV__
      : {};

  if (injectedEnv && injectedEnv.url && injectedEnv.anonKey) {
    return injectedEnv;
  }

  try {
    const response = await fetch('/api/supabase-env', { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) {
      return {};
    }

    if (data && data.url && data.anonKey) {
      window.__SUPABASE_ENV__ = {
        url: data.url,
        anonKey: data.anonKey,
      };
      return window.__SUPABASE_ENV__;
    }

    return {};
  } catch (error) {
    console.error('[supabase-browser] Failed to fetch Supabase env from /api/supabase-env:', error);
    return {};
  }
}

async function initSupabaseBrowser() {
  // Prevent double-load
  if (window.__SUPABASE_BROWSER_INIT__) return;
  window.__SUPABASE_BROWSER_INIT__ = true;

  const env = await loadSupabaseEnv();
  const url = env && env.url;
  const anonKey = env && env.anonKey;

  const missing = [];
  if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!anonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (missing.length) {
    console.error(
      `[supabase-browser] Supabase env vars missing: ${missing.join(', ')}. ` +
        'Set them in Vercel Environment Variables (NEXT_PUBLIC_*), or create a local .env.local file and restart the dev server.'
    );
    window.supabase = null;
    return;
  }

  // Load a browser-safe supabase-js bundle and create the client.
  // Using UMD is mobile-friendly and works with static pages in /public.
  const script = document.createElement('script');
  script.src =
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
  script.async = true;

  script.onload = function () {
    try {
      if (!window.supabaseJs || typeof window.supabaseJs.createClient !== 'function') {
        console.error('[supabase-browser] supabaseJs global missing after CDN load');
        window.supabase = null;
        return;
      }

      window.supabase = window.supabaseJs.createClient(url, anonKey, {
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



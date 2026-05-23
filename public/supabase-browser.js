/* global window */

// Bootstraps a Supabase client for static pages (public/*.html).
// Expects window.__SUPABASE_ENV__ to be injected by app/layout.js
(function initSupabaseBrowser() {
  try {
    const env = window.__SUPABASE_ENV__ || {};
    const url = env.url;
    const anonKey = env.anonKey;

    if (!url || !anonKey) {
      console.warn('[supabase-browser] Missing env. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
      return;
    }

    // Use the CDN build for static usage.
    // This avoids needing bundlers for the static public/*.html pages.
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
    s.async = true;
    s.onload = function () {
      if (!window.supabase) {
        window.supabase = window.supabaseJs.createClient(url, anonKey);
      }

      // Optionally enable realtime.
      console.log('[supabase-browser] Supabase client ready');
    };
    document.head.appendChild(s);
  } catch (err) {
    console.error('[supabase-browser] init failed', err);
  }
})();


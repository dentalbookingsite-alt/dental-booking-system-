/* global window */

// Bootstraps a Supabase client for static pages (public/*.html).
// Expects window.__SUPABASE_ENV__ to be injected by app/layout.js
(function initSupabaseBrowser() {
  try {
    const env = (typeof window !== 'undefined' && window.__SUPABASE_ENV__) ? window.__SUPABASE_ENV__ : {};
    const url = env.url;
    const anonKey = env.anonKey;

    if (!url || !anonKey) {
      console.error(
        '[supabase-browser] Supabase env vars missing. ' +
        'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel/Local.'
      );
      // Prevent hard crashes: downstream code will check window.supabase
      window.supabase = null;
      return;
    }

    // Use the CDN build for static usage.
    // This file lives in /public so it must be plain JS (no imports/exports).
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
    s.async = true;

    s.onload = function () {
      try {
        if (!window.supabase) {
          window.supabase = window.supabaseJs.createClient(url, anonKey, {
            auth: { persistSession: false },
          });
        }
        console.log('[supabase-browser] Supabase client ready');
      } catch (e) {
        console.error('[supabase-browser] createClient failed:', e);
        window.supabase = null;
      }
    };

    s.onerror = function (e) {
      console.error('[supabase-browser] Failed to load supabase-js CDN:', e);
      window.supabase = null;
    };

    document.head.appendChild(s);
  } catch (err) {
    console.error('[supabase-browser] init failed', err);
    window.supabase = null;
  }
})();

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;


if (!supabase) {
  alert("Supabase is not connected.");
  return;
}
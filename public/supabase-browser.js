import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

let supabase = null;
window.supabase = null;
window.supabaseReady = false;
window.__SUPABASE_BROWSER_STATUS__ = 'missing-env';

if (!supabaseUrl || !supabaseKey) {
  console.error('[supabase-browser] Missing Supabase environment variables.');
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
  window.supabase = supabase;
  window.supabaseReady = true;
  window.__SUPABASE_BROWSER_STATUS__ = 'ready';
  console.log('[supabase-browser] Supabase initialized.');
}

export default supabase;
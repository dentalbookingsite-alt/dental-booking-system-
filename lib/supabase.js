import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error(
    "Supabase env vars missing:",
    supabaseUrl,
    supabaseAnonKey
  );
}

if (!supabase) {
  alert("Supabase not connected");
  return;
}

const { data, error } = await supabase
  .from("appointments")
  .insert([formData]);

export default supabase;


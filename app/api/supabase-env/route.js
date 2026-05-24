export async function GET() {
  const url = process.env.VITE_SUPABASE_URL || '';
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

  return Response.json({
    url,
    anonKey,
    missing: [
      !url ? 'VITE_SUPABASE_URL' : null,
      !anonKey ? 'VITE_SUPABASE_ANON_KEY' : null,
    ].filter(Boolean),
  });
}

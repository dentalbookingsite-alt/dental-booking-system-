export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return Response.json({
    url,
    anonKey,
    missing: [
      !url ? 'NEXT_PUBLIC_SUPABASE_URL' : null,
      !anonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : null,
    ].filter(Boolean),
  });
}

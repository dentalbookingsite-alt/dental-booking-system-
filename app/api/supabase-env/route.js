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

export async function GET() {
  const url = normalizeSupabaseUrl(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
  );
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    '';

  return Response.json({
    url,
    anonKey,
    missing: [
      !url ? 'NEXT_PUBLIC_SUPABASE_URL / VITE_SUPABASE_URL' : null,
      !anonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY / VITE_SUPABASE_ANON_KEY' : null,
    ].filter(Boolean),
  });
}

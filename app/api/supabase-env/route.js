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
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const missing = [
    !url ? 'NEXT_PUBLIC_SUPABASE_URL' : null,
    !anonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : null,
  ].filter(Boolean);

  if (missing.length) {
    return Response.json(
      {
        url: '',
        anonKey: '',
        missing,
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }

  return Response.json(
    {
      url,
      anonKey,
      missing: [],
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}

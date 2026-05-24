import { createClient } from '@supabase/supabase-js'

function normalizeSupabaseUrl(value) {
  if (!value) return ''

  const trimmed = String(value).trim().replace(/\/+$/, '')
  if (!trimmed) return ''

  if (trimmed.endsWith('/rest/v1')) {
    return trimmed.slice(0, -'/rest/v1'.length)
  }

  if (trimmed.endsWith('/rest/v1/')) {
    return trimmed.slice(0, -'/rest/v1/'.length)
  }

  return trimmed
}

const supabaseUrl = normalizeSupabaseUrl(
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    (typeof window !== 'undefined' && window.__SUPABASE_ENV__?.url
      ? window.__SUPABASE_ENV__.url
      : '')
)

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  (typeof window !== 'undefined' && window.__SUPABASE_ENV__?.anonKey
    ? window.__SUPABASE_ENV__.anonKey
    : '')

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables are not configured. Set NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY or VITE_* values.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    throw error
  }

  if (data.user) {
    const profileResult = await supabase.from('profiles').upsert(
      {
        id: data.user.id,
        email: data.user.email,
        role: 'customer',
      },
      { onConflict: 'id' }
    )

    if (profileResult.error) {
      throw profileResult.error
    }
  }

  return data
}

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return data.user
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export const auth = {
  signUp,
  login,
  getCurrentUser,
  logout,
}
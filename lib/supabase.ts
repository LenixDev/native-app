import { createClient } from '@supabase/supabase-js'

export const supabase = (() => {
  const { EXPO_PUBLIC_SUPABASE_ANON_KEY, EXPO_PUBLIC_SUPABASE_PROJECT_ID } = process.env
  if (!EXPO_PUBLIC_SUPABASE_ANON_KEY) throw new Error("missing .env > EXPO_PUBLIC_SUPABASE_ANON_KEY", { cause: { EXPO_PUBLIC_SUPABASE_ANON_KEY } })
  if (!EXPO_PUBLIC_SUPABASE_PROJECT_ID) throw new Error("missing .env > EXPO_PUBLIC_SUPABASE_PROJECT_ID", { cause: { EXPO_PUBLIC_SUPABASE_PROJECT_ID } })

  const SUPABASE_URL = `https://${EXPO_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`
  return createClient(SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY)
})()
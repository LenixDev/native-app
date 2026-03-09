import { createClient } from '@supabase/supabase-js'

export const supabase = (() => {
  const { SUPABASE_ANON_KEY, SUPABASE_PROJECT_ID } = process.env
  if (!SUPABASE_ANON_KEY || !SUPABASE_PROJECT_ID) throw new Error("missing .env keys")
  
  const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.com`
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
})()
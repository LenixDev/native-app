import { supabase } from "@/lib/supabase"

export const signin = async (phone: string, password: string) => {
  const result = await supabase.auth.signInWithPassword({ phone, password })
  return result
}
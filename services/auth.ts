import { supabase } from '@/lib/supabase'

export const signin = async (phone: string, password: string) => {
  const result = await supabase.auth.signInWithPassword({ phone, password })
  return result
}

export const signup = async (phone: string, password: string) => {
  const result = await supabase.auth.signUp({ phone, password })
  return result
}

export const verify = async (
  phone: string,
  token: string,
): Promise<[true] | [false, string]> => {
  const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
  if (error) return [false, error.message]
  return [true]
}

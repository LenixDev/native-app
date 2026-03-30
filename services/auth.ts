import { verificationKey } from '@/constants'
import { supabase } from '@/lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const signin = async (phone: string, password: string) => {
  const result = await supabase.auth.signInWithPassword({ phone, password })
  return result
}

export const signup = async (phone: string, password: string, name: string) => {
  const result = await supabase.auth.signUp({ phone, password, options: { data: { display_name: name } } })
  if (!result.error) await AsyncStorage.setItem(verificationKey, phone)
  return result
}

export const signout = async (): Promise<[true] | [false, string]> => {
  const { error } = await supabase.auth.signOut()
  if (error) return [false, error.message]
  return [true]
}

export const verify = async (
  phone: string,
  token: string,
): Promise<[true] | [false, string]> => {
  const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
  if (error) return [false, error.message]
  await AsyncStorage.removeItem(verificationKey)
  return [true]
}

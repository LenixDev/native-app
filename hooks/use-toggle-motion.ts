import { supabase } from "@/lib/supabase"
import type { Account } from "@/types"
import { useToast } from "heroui-native"

export const useToggleMotion = () => {
  const { toast } = useToast()

  return async (motion: Account['motion']) => {
    const { error: userError, data } = await supabase.auth.getUser()
    if (userError) {
      toast.show(userError.message)
      return false
    }
    const { error } = await supabase.from('accounts').update({ motion }).eq('id', data.user.id)
    if (error) {
      toast.show(error.message)
      return false
    }
    return true
  }
}
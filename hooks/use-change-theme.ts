import { supabase } from "@/lib/supabase"
import type { Theme } from "@/types"
import { useToast } from "heroui-native"

export const useChangeTheme = () => {
  const { toast } = useToast()

  return async (theme: Theme) => {
    const { error: userError, data } = await supabase.auth.getUser()
    if (userError) {
      toast.show(userError.message)
      return false
    }
    const { error } = await supabase.from('accounts').update({ theme }).eq('id', data.user.id)
    if (error) {
      toast.show(error.message)
      return false
    }
    return true
  }
}
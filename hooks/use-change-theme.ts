import { supabase } from "@/lib/supabase"
import type { Theme } from "@/types"
import { useToast } from "heroui-native"

export const useChangeTheme = () => {
  const { toast } = useToast()

  return async (theme: Theme) => {
    const { error } = await supabase.from('accounts').update({ theme })
    if (error) {
      toast.show(error.message)
      return false
    }
    return true
  }
}
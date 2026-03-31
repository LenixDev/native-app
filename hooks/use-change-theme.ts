import { supabase } from "@/lib/supabase"
import type { Theme } from "@/types"
import { useToast } from "heroui-native"
import { useTranslation } from "react-i18next";
import { Appearance } from "react-native";
import { Uniwind } from 'uniwind';

export const useChangeTheme = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  let deviceTheme = Appearance.getColorScheme()
  if (!deviceTheme) {
    toast.show(t("theme_error"))
    console.warn('Theme error')
    deviceTheme = 'light'
  }

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
    Uniwind.setTheme(theme === 'system' ? deviceTheme : theme)
    return true
  }
}
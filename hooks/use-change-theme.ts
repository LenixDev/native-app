import { supabase } from '@/lib/supabase'
import { deviceTheme } from '@/lib/theme'
import type { Theme } from '@/types'
import { useToast } from 'heroui-native'
import { Uniwind } from 'uniwind'

export const useChangeTheme = () => {
	const { toast } = useToast()

	return async (theme: Theme) => {
		const { error: userError, data } = await supabase.auth.getSession()
		if (userError || !data.session) {
			toast.show(userError?.message || 'could not retrieve user from session')
			return false
		}

		const { error } = await supabase
			.from('accounts')
			.update({ theme })
			.eq('id', data.session.user.id)
		if (error) {
			toast.show(error.message)
			return false
		}

		Uniwind.setTheme(theme === 'system' ? deviceTheme() : theme)
		return true
	}
}

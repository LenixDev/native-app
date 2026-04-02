import { supabase } from '@/lib/supabase'
import type { Account } from '@/types'
import { useToast } from 'heroui-native'

export const useToggleMotion = () => {
	const { toast } = useToast()

	return async (motion: Account['motion']) => {
		const { error: userError, data } = await supabase.auth.getSession()
		if (userError || !data.session) {
			toast.show(userError?.message || 'could not retrieve user from session')
			return false
		}
		const { error } = await supabase
			.from('accounts')
			.update({ motion })
			.eq('id', data.session.user.id)
		if (error) {
			toast.show(error.message)
			return false
		}
		return true
	}
}

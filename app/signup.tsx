import { signup } from '@/services/auth'
import { router } from 'expo-router'
import { useToast } from 'heroui-native'
import { useTranslation } from 'react-i18next'
import { Auth } from '../components/auth'

export default function Page() {
	const { t } = useTranslation()
	const { toast } = useToast()

	const auth = async (phone: string, password: string, name: string) => {
		const { error } = await signup(phone, password, name)
		if (error) {
			toast.show(error.message)
			return
		}
		toast.show(t('signup_success'))
		router.replace('/verify')
	}

	return (
		<Auth
			{...{
				auth,
				authLabel: t('signup'),
				exMethodLabel: t('signin'),
				exMethod: '/signin',
				passwordLength: 6,
				nameLength: 3,
			}}
		/>
	)
}

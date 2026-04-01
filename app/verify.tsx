import { BottomModal } from '@/components/bottom-modal'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { changeKey, verificationKey } from '@/constants'
import { supabase } from '@/lib/supabase'
import { raise } from '@/lib/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import {
	BottomSheet,
	Button,
	Description,
	Label,
	LinkButton,
} from 'heroui-native'
import { InputOTP, type InputOTPRef } from 'heroui-native/input-otp'
import { useToast } from 'heroui-native/toast'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// eslint-disable-next-line max-lines-per-function, max-statements
export default function Page() {
	const { toast } = useToast()
	const { t } = useTranslation()

	const ref = useRef<InputOTPRef>(null)
	const [phone, setPhone] = useState<string | null>(null)
	const [open, setOpen] = useState(false)
	const [isChange, setIsChange] = useState<boolean | null>(null)

	useEffect(() => {
		AsyncStorage.getItem(verificationKey)
			.then(value => {
				if (typeof value === 'string')
					AsyncStorage.getItem(changeKey)
						.then(val => {
							setIsChange(typeof val === 'string')
							setPhone(value)
						})
						.catch(raise)
				else router.replace('/signin')
			})
			.catch(raise)
	}, [])

	if (phone === null || isChange === null) return null

	const maskedNumber = `${phone.slice(0, 6)}${'*'.repeat(Math.max(0, phone.length - 7))}${phone[phone.length - 1]}`

	const onComplete = async (token: string) => {
		const { error } = await supabase.auth.verifyOtp({ phone, token, type: isChange ? 'phone_change' : 'sms' })
		if (error) {
			toast.show(error.message)
			ref.current?.clear()
			return
		}
		await AsyncStorage.removeItem(verificationKey)
		toast.show(t(isChange ? 'phone_updated' : 'account_verified'))
		router.replace(isChange ? '/(tabs)/settings/account' : '/(tabs)/home')
	}

	return (
		<KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<View className='flex-1 items-center justify-between w-full px-5 py-20'>
				{!isChange && (
					<Button
						variant='ghost'
						isIconOnly
						className='absolute top-5 right-5'
						onPress={() => {
							setOpen(true)
						}}
					>
						<IconSymbol color={'red'} name='info.circle' size={18} />
					</Button>
				)}
				<View className='px-5 justify-center gap-3'>
					<View>
						<Label>{t('verify_account')}</Label>
						<Description>{t('sent_to', { maskedNumber })}</Description>
					</View>
					<InputOTP
						ref={ref}
						maxLength={6}
						onComplete={self => {
							onComplete(self).catch(raise)
						}}
					>
						<InputOTP.Group>
							{[0, 1, 2].map(iter => (
								<InputOTP.Slot key={iter} index={iter} />
							))}
						</InputOTP.Group>
						<InputOTP.Separator />
						<InputOTP.Group>
							{[3, 4, 5].map(iter => (
								<InputOTP.Slot key={iter} index={iter} />
							))}
						</InputOTP.Group>
					</InputOTP>
					<View className='flex-row items-center gap-2'>
						<Description>{t('did_not_receive')}</Description>
						<LinkButton>
							<LinkButton.Label className='dark:text-accent'>
								{t('resend')}
							</LinkButton.Label>
						</LinkButton>
					</View>
					<BottomModal open={open} setOpen={setOpen}>
						<View className='gap-8'>
							<BottomSheet.Title>{t('important')}</BottomSheet.Title>
							<Description>
								{t('account_not_verified', { amount: 30 })}
							</Description>
							<Button
								variant='tertiary'
								onPress={() => {
									setOpen(false)
								}}
							>
								{t('understood')}
							</Button>
						</View>
					</BottomModal>
				</View>
				<Button
					className='w-full'
					variant={isChange ? 'outline' : 'danger-soft'}
					onPress={() => {
						router.replace(isChange ? '/(tabs)/settings/account' : '/signin')
						AsyncStorage.removeItem(verificationKey).catch(raise)
						isChange && AsyncStorage.removeItem(changeKey).catch(raise)
					}}
				>
					{isChange ? t('abort') : t('signout')}
				</Button>
			</View>
		</KeyboardAwareScrollView>
	)
}

import { PasswordInput } from '@/components/auth/password'
import { BottomModal } from '@/components/bottom-modal'
import { DialogProvider } from '@/components/dialog'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { changeKey, resetKey, verificationKey } from '@/constants'
import { useRTL } from '@/hooks/use-rtl'
import { supabase } from '@/lib/supabase'
import { raise } from '@/lib/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import {
	BottomSheet,
	Button,
	Description,
	Dialog,
	Label,
	LinkButton,
} from 'heroui-native'
import { InputOTP, type InputOTPRef } from 'heroui-native/input-otp'
import { useToast } from 'heroui-native/toast'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// eslint-disable-next-line max-lines-per-function, max-statements
export default function Page() {
	const { toast } = useToast()
	const { t } = useTranslation()
	const rtl = useRTL()

	const ref = useRef<InputOTPRef>(null)
	const [phone, setPhone] = useState<string | null>(null)
	const [open, setOpen] = useState(false)
	const [isChange, setIsChange] = useState<boolean | null>(null)
	const [isReset, setIsReset] = useState<boolean | null>(null)
	const [isDialogOn, setIsDialogOn] = useState(false)
	const [newPassword, setNewPassword] = useState('')

	const sendResetCode = (phoneNumber: string) => {
		supabase.auth
			.signInWithOtp({ phone: phoneNumber })
			.then(({ error }) => {
				if (error) toast.show(error.message)
			})
			.catch(raise)
	}

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
			else setIsChange(false)
			AsyncStorage.getItem(resetKey)
				.then(val => {
					if (typeof val === 'string') {
						setIsReset(true)
						setPhone(val)
						sendResetCode(val)
					} else {
						router.replace('/signin')
						setIsReset(false)
					}
				})
				.catch(raise)
		})
		.catch(raise)
	}, [sendResetCode])

	if (phone === null || isChange === null || isReset === null) return null

	const maskedNumber = `${phone.slice(0, 6)}${'*'.repeat(Math.max(0, phone.length - 7))}${phone[phone.length - 1]}`

	// eslint-disable-next-line max-statements
	const onComplete = async (token: string) => {
		const { error } = await supabase.auth.verifyOtp({
			phone,
			token,
			type: isChange ? 'phone_change' : 'sms',
		})
		ref.current?.clear()
		ref.current?.blur()
		if (error) {
			toast.show(error.message)
			return
		}
		if (isReset) {
			setIsDialogOn(true)
			return
		}
		await AsyncStorage.removeItem(verificationKey)
		toast.show(t(isChange ? 'phone_updated' : 'account_verified'))
		router.replace(isChange ? '/(tabs)/settings' : '/(tabs)/home')
	}

	return (
		<KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<View className='flex-1 items-center justify-between w-full px-5 py-20'>
				{!isChange && !isReset && (
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
					<View className={rtl('items-end')}>
						<Label>{t('verify_account')}</Label>
						<View className={`flex-row ${rtl('flex-row-reverse')} gap-1`}>
							<Description>{t('sent_to')}</Description><Description className='text-foreground'>{maskedNumber}</Description>
						</View>
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
					<View className={`flex-row ${rtl('flex-row-reverse')} items-center gap-2 justify-start`}>
						<Description>{t('did_not_receive')}</Description>
						<LinkButton
							onPress={() => {
								isReset && sendResetCode(phone)
							}}
						>
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
					variant={isChange || isReset ? 'outline' : 'danger-soft'}
					onPress={() => {
						router.replace(isChange ? '/(tabs)/settings' : '/signin')
						AsyncStorage.removeItem(verificationKey).catch(raise)
						isChange && AsyncStorage.removeItem(changeKey).catch(raise)
						isReset && AsyncStorage.removeItem(resetKey).catch(raise)
					}}
				>
					{isChange || isReset ? t('abort') : t('signout')}
				</Button>
				<KeyboardAvoidingView behavior='padding'>
					<DialogProvider isOpen={isDialogOn} setIsOpen={setIsDialogOn}>
						<View className='gap-5'>
							<Dialog.Title>New Password</Dialog.Title>
							<PasswordInput
								className='bg-background'
								onChangeText={value => {
									setNewPassword(value)
								}}
							/>
							<Button
								onPress={() => {
									supabase.auth
										.updateUser({ password: newPassword })
										.then(({ error }) => {
											if (error) {
												toast.show(error.message)
												return
											}
											router.replace('/(tabs)/home')
											toast.show('The password was reset successfuly')
										})
										.catch(raise)
								}}
							>
								Update
							</Button>
						</View>
					</DialogProvider>
				</KeyboardAvoidingView>
			</View>
		</KeyboardAwareScrollView>
	)
}

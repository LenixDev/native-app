import { ModalProvider } from '@/components/auth/countries'
import { PasswordInput } from '@/components/auth/password'
import { PhoneInput } from '@/components/auth/phone'
import { DialogProvider } from '@/components/dialog'
import { changeKey, verificationKey } from '@/constants'
import { useRTL } from '@/hooks/use-rtl'
import { supabase } from '@/lib/supabase'
import { isValidPassword, raise } from '@/lib/utils'
import type { Country } from '@/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import {
	Button,
	Description,
	Dialog,
	Label,
	Separator,
	Surface,
	TextField,
	useToast,
} from 'heroui-native'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// eslint-disable-next-line max-lines-per-function, max-statements
export default function Page() {
	const { toast } = useToast()
	const { t } = useTranslation()
	const rtl = useRTL()

	const [isDialogOn, setIsDialogOn] = useState(false)
	const [isCountryOpen, setIsCountryOpen] = useState(false)

	const [operation, setOperation] = useState<
		'password' | 'phone' | 'signout' | 'deletion'
	>('phone')
	const [{ current_password, country, ...credentials }, setCredentials] =
		useState<
			Record<'country', Country[number] | null>
				& Record<'phone' | 'password' | 'current_password', string>
		>({
			password: '',
			phone: '',
			country: null,
			current_password: '',
		})

	const handleUpdate = (type: 'password' | 'phone') => {
		if (type === 'phone' && !country) {
			raise('failed to handle account update. cause: country was falsy')
			return
		}
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const phoneNumber = `${country!.dial}${credentials.phone}`
		const credential = type === 'phone' ? phoneNumber : credentials.password
		supabase.auth
			.updateUser({ [type]: credential, current_password })
			.then(({ error }) => {
				if (error) {
					toast.show(error.message)
					return
				}
				setIsDialogOn(false)
				if (type === 'phone') {
					AsyncStorage.setItem(verificationKey, phoneNumber)
						.then(() => {
							AsyncStorage.setItem(changeKey, 'phone')
								.then(() => {
									router.replace('/verify')
								})
								.catch(raise)
						})
						.catch(raise)
					return
				}
				toast.show(t('account_updated'))
				setCredentials(prev => ({ ...prev, [type]: '' }))
			})
			.catch(raise)
	}

	const handleSignout = () => {
		supabase.auth
			.signOut({ scope: 'others' })
			.then(({ error }) => {
				if (error) {
					toast.show(error.message)
					return
				}
				toast.show(t('signout_success'))
				setIsDialogOn(false)
			})
			.catch(raise)
	}

	const handleDeletion = () => {
		supabase.auth.admin
			.deleteUser('', true)
			.then(({ error }) => {
				if (error) {
					toast.show(error.message)
					return
				}
				toast.show(t('account_deleted'))
				setIsDialogOn(false)
			})
			.catch(raise)
	}

	return (
		<>
			<KeyboardAwareScrollView showsVerticalScrollIndicator>
				<View className='flex-1 justify-center px-3 gap-8 my-5 mt-20'>
					<KeyboardAvoidingView behavior='padding'>
						<Text className={`text-2xl mb-2 mx-4 text-foreground ${rtl('text-right')}`}>
							{t('phone')}
						</Text>
						<Surface className='gap-5'>
							<TextField>
								<Label>
									<Label.Text className={rtl('text-right')}>{t('new_phone')}</Label.Text>
								</Label>
								<PhoneInput
									{...{ isCountryOpen, country }}
									onCodeSelect={() => {
										setIsCountryOpen(true)
									}}
									phone={credentials.phone}
									onChange={me => {
										setCredentials(prev => ({ ...prev, phone: me }))
									}}
								/>
								<Description className={rtl('text-right')}>{t('phone_context')}</Description>
							</TextField>
							<Button
								variant='tertiary'
								isDisabled={credentials.phone.length === 0 || country === null}
								onPress={() => {
									setOperation('phone')
									// setIsDialogOn(true)
									handleUpdate('phone')
								}}
							>
								{t('update')}
							</Button>
						</Surface>
					</KeyboardAvoidingView>
					<Separator />
					<KeyboardAvoidingView>
						<Text className={`text-2xl mb-2 mx-4 text-foreground ${rtl('text-right')}`}>
							{t('password')}
						</Text>
						<Surface className='gap-5'>
							<TextField>
								<Label>
									<Label.Text className={rtl('text-right')}>{t('new_password')}</Label.Text>
								</Label>
								<PasswordInput
									value={credentials.password}
									onChangeText={me => {
										setCredentials(prev => ({ ...prev, password: me }))
									}}
								/>
								<Description className={rtl('text-right')}>{t('password_context')}</Description>
							</TextField>
							<Button
								variant='tertiary'
								isDisabled={credentials.password.length === 0}
								onPress={() => {
									if (!isValidPassword(credentials.password)) {
										toast.show(t('password_short'))
										return
									}
									setOperation('password')
									// setIsDialogOn(true)
									handleUpdate('password')
								}}
							>
								{t('update')}
							</Button>
						</Surface>
					</KeyboardAvoidingView>
					<Separator />
					<Button
						variant='outline'
						onPress={() => {
							setOperation('signout')
							setIsDialogOn(true)
						}}
					>
						{t('signout_others')}
					</Button>
					<Button
						variant='danger-soft'
						onPress={() => {
							setOperation('deletion')
							setIsDialogOn(true)
						}}
					>
						{t('delete_account')}
					</Button>
				</View>
			</KeyboardAwareScrollView>
			<DialogProvider isOpen={isDialogOn} setIsOpen={setIsDialogOn}>
				<View className='gap-5'>
					<Dialog.Title>
						{operation === 'phone' && t('are_you_sure')}
						{operation === 'signout' && t('are_you_sure')}
						{operation === 'deletion' && t('are_you_sure')}
					</Dialog.Title>
					<TextField>
						{/* eslint-disable-next-line no-nested-ternary */}
						{operation === 'password' ?
							<>
								<Label>{t('current_password')}</Label>
								<PasswordInput
									value={current_password}
									onChangeText={me => {
										setCredentials(prev => ({ ...prev, current_password: me }))
									}}
								/>
								<Description>{t('current_password_context')}</Description>
							</>
						: operation === 'deletion' ?
							<Description>{t('this_ereversable')}</Description>
						:	operation === 'signout' && (
								<Description>{t('signout_context')}</Description>
							)
						}
					</TextField>
					<Button
						onPress={() => {
							if (operation === 'phone' || operation === 'password')
								handleUpdate(operation)
							else if (operation === 'signout') handleSignout()
							else handleDeletion()
						}}
						variant={
							operation === 'deletion' || operation === 'signout' ?
								'danger'
							:	'primary'
						}
					>
						{/* eslint-disable-next-line no-nested-ternary */}
						{operation === 'phone' || operation === 'password' ?
							t('save')
						: operation === 'signout' ?
							t('signout')
						:	t('delete')}
					</Button>
				</View>
			</DialogProvider>
			<ModalProvider
				visible={isCountryOpen}
				onDismiss={() => {
					setIsCountryOpen(false)
				}}
				onSelect={(countryItem: Country[number]) => {
					setCredentials(prev => ({ ...prev, country: countryItem }))
				}}
			/>
		</>
	)
}

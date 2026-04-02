import { IconSymbol } from '@/components/ui/icon-symbol'
import { raise, isValidName, isValidPassword } from '@/lib/utils'
import { type Href, router } from 'expo-router'
import {
	Button,
	Dialog,
	InputGroup,
	LinkButton,
	Separator,
	useThemeColor,
	useToast,
} from 'heroui-native'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Text, View, type TextInput } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { PasswordInput } from './password'
import { PhoneInput } from './phone'
import { ModalProvider } from './countries'
import type { Country } from '@/types'
import { useIsRTL, useRTL } from '@/hooks/use-rtl'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { resetKey } from '@/constants'
import { DialogProvider } from '../dialog'

// HARD & COMPLEXE :)

// eslint-disable-next-line max-lines-per-function, max-statements
export const Auth = ({
	auth,
	authLabel,
	exMethodLabel,
	exMethod,
}: {
	auth: (phone: string, password: string, name?: string) => Promise<void>
	authLabel: string
	exMethodLabel: string
	exMethod: Href
}) => {
	const { t } = useTranslation()
	const muted = useThemeColor('muted')
	const { toast } = useToast()
	const isRtl = useIsRTL()
	const rtl = useRTL()

	const passwordRef = useRef<TextInput>(null)
	const phoneRef = useRef<TextInput>(null)
	interface Form {
		phone: string
		password: string
		country: Country[number] | null
		name: string
	}
	const [{ phone, password, country, name }, setForm] = useState<Form>({
		phone: '',
		password: '',
		country: null,
		name: '',
	})
	const [isCountryOpen, setIsCountryOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [isDialogOn, setIsDialogOn] = useState(false)

	const isSignup = exMethod === '/signin'

	// eslint-disable-next-line max-statements
	const handleAuth = async () => {
		if (isSignup && !isValidName(name)) {
			toast.show(t('name_error'))
			return
		}
		if (country === null) {
			toast.show(t('country_code_error'))
			return
		}
		if (isSignup && !isValidPassword(password)) {
			toast.show(t('password_short'))
			return
		}
		setLoading(true)
		await auth(`${country.dial}${phone}`, password, name)
		setLoading(false)
	}

	return (
		<KeyboardAwareScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			keyboardShouldPersistTaps='handled'
			showsVerticalScrollIndicator={false}
		>
			<View className='flex justify-evenly items-center h-full px-4'>
				<View className='flex-1 flex justify-center'>
					<Text className='text-foreground text-5xl'>Thrivenix</Text>
				</View>

				<KeyboardAvoidingView
					behavior='padding'
					className='w-full justify-center flex gap-4 flex-1'
				>
					{isSignup && (
						<View className='flex gap-2'>
							<InputGroup>
								{isRtl ? <InputGroup.Suffix>
									<IconSymbol color={muted} name='person' size={16} />
								</InputGroup.Suffix>
								: <InputGroup.Prefix>
									<IconSymbol color={muted} name='person' size={16} />
								</InputGroup.Prefix>}
								<InputGroup.Input
									textAlign={isRtl ? 'right' : 'left'}
									onSubmitEditing={() => phoneRef.current?.focus()}
									returnKeyType='next'
									placeholder={t('fake_name')}
									autoCorrect={false}
									value={name}
									onChangeText={self => {
										setForm(form => ({ ...form, name: self }))
									}}
								/>
							</InputGroup>
						</View>
					)}
					<View className='flex gap-2'>
						<PhoneInput
							{...{ country, isCountryOpen, phone }}
							onCodeSelect={() => {
								setIsCountryOpen(true)
							}}
							onChange={me => {
								setForm(form => ({ ...form, phone: me }))
							}}
							ref={phoneRef}
							onSubmitEditing={() => passwordRef.current?.focus()}
						/>
					</View>

					<PasswordInput
						ref={passwordRef}
						value={password}
						onChangeText={self => {
							setForm(form => ({ ...form, password: self }))
						}}
					/>
					{!isSignup && (
						<>
							<View className={`w-full -mx-5 ${isRtl ? 'mx-5 items-start' : 'items-end'}`}>
								<LinkButton size='sm' onPress={() => {
									if (phone.length === 0 || country === null) {
										toast.show('Please enter the account\'s phone number that you want to reset his password first and make sure to select a country code')
										return
									}
									setIsDialogOn(true)
								}}>
									<LinkButton.Label className='text-muted'>{t('reset_password')}</LinkButton.Label>
								</LinkButton>
							</View>
							<DialogProvider isOpen={isDialogOn} setIsOpen={setIsDialogOn}>
								<View className='gap-5'>
									<Dialog.Title className={`text-foreground text-2xl ${rtl('text-right')}`}>Reset Password</Dialog.Title>
									{/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-extra-non-null-assertion, @typescript-eslint/no-unnecessary-condition */}
									<Dialog.Description className={rtl('text-right')}>Are you sure this the phone number {country!?.dial}{phone}?</Dialog.Description>
									<Button onPress={() => {
										AsyncStorage
										.setItem(resetKey, 'password')
										.then(() => {
											AsyncStorage
											// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
											.setItem(resetKey, `${country!.dial}${phone}`)
											.then(() => {
												router.replace('/verify')
											}).catch(raise)
										}).catch(raise)
									}}>Get Code</Button>
								</View>
							</DialogProvider>
						</>
					)}
				</KeyboardAvoidingView>

				<View className='justify-center w-full'>
					<Button
						variant='primary'
						onPress={() => {
							handleAuth().catch(raise)
						}}
						isDisabled={
							loading
							|| phone.length === 0
							|| country === null
							|| password.length === 0
							|| (isSignup && name.length === 0)
						}
					>
						<Button.Label className='dark:text-background text-foreground'>
							{authLabel}
						</Button.Label>
					</Button>
				</View>

				<ModalProvider
					visible={isCountryOpen}
					onDismiss={() => {
						setIsCountryOpen(false)
					}}
					onSelect={(countryItem: Country[number]) => {
						setForm(form => ({ ...form, country: countryItem }))
					}}
				/>

				<View className='w-full flex justify-evenly items-center flex-1'>
					<View className='flex flex-row items-center gap-4 w-2/3'>
						<Separator className='bg-muted flex-1' />
						<Text className='text-foreground'>{t('or')}</Text>
						<Separator className='bg-muted flex-1' />
					</View>
					<Button
						variant='outline'
						onPress={() => {
							router.replace(exMethod)
						}}
					>
						<Button.Label className='text-foreground'>
							{exMethodLabel}
						</Button.Label>
					</Button>
				</View>
			</View>
		</KeyboardAwareScrollView>
	)
}

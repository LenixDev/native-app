import { IconSymbol } from '@/components/ui/icon-symbol'
import countries from '@/lib/countries.json' with { type: 'json' }
import { flag, raise } from '@/lib/utils'
import { type Href, router } from 'expo-router'
import {
	Button,
	FieldError,
	InputGroup,
	Separator,
	useThemeColor,
	useToast,
} from 'heroui-native'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	FlatList,
	KeyboardAvoidingView,
	Modal,
	Pressable,
	Text,
	View,
} from 'react-native'
import type { TextInput } from 'react-native-gesture-handler'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

type Country = typeof countries

// HARD & COMPLEXE :)

// eslint-disable-next-line max-lines-per-function, max-statements
export const Auth = ({
	auth,
	authLabel,
	exMethodLabel,
	exMethod,
	passwordLength,
	nameLength,
}: {
	auth: (phone: string, password: string, name?: string) => Promise<void>
	authLabel: string
	exMethodLabel: string
	exMethod: Href
	passwordLength?: number
	nameLength?: number
}) => {
	const { t } = useTranslation()
	const [muted, danger] = useThemeColor(['muted', 'danger'])
	const { toast } = useToast()
	const passwordRef = useRef<TextInput>(null)
	const phoneRef = useRef<TextInput>(null)
	interface Form {
		phone: string
		password: string
		country: Country[number] | null
		name: string
	}
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)
	const [{ phone, password, country, name }, setForm] = useState<Form>({
		phone: '',
		password: '',
		country: null,
		name: '',
	})
	const [isCountryOpen, setIsCountryOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [invalid, setInvalid] = useState<Record<keyof Form, boolean>>({
		phone: false,
		password: false,
		country: false,
		name: false,
	})

	const handleAuth = async () => {
		setLoading(true)
		if (typeof country?.dial !== 'string') {
			toast.show(t('unretrievable_country_code'))
			setLoading(false)
			return
		}
		const phoneNumber = `${country.dial}${phone}`
		await auth(phoneNumber, password, name)
		setLoading(false)
	}

	const handleValid = (condition: boolean, key: keyof Form) => {
		setInvalid(prev => ({ ...prev, [key]: !condition }))
	}

	const isSignup =
		typeof passwordLength === 'number'
		&& typeof nameLength === 'number'
		&& exMethod === '/signin'
	const isValidName = /^[\p{L}\s]+$/u.test(name) && name.length >= (nameLength ?? 3)
	const isValidPassword = (self: string) =>
		typeof passwordLength === 'number' ?
			self.length >= passwordLength
		:	password.length > 0

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
								<InputGroup.Prefix>
									<IconSymbol color={muted} name='person' size={16} />
								</InputGroup.Prefix>
								<InputGroup.Input
									onSubmitEditing={() => phoneRef.current?.focus()}
									returnKeyType='next'
									placeholder={t('fake_name')}
									autoCorrect={false}
									value={name}
									onBlur={() => {
										handleValid(isValidName, 'name')
									}}
									onChangeText={self => {
										setForm(form => ({ ...form, name: self }))
										handleValid(isValidName, 'name')
									}}
									isInvalid={invalid.name}
								/>
							</InputGroup>
							<FieldError isInvalid={invalid.name}>
								{t('name_error')}
							</FieldError>
						</View>
					)}
					<View className='flex gap-2'>
						<InputGroup>
							<InputGroup.Prefix className='px-0'>
								<Pressable
									className={`flex-1 w-full px-4 justify-center ${invalid.country && 'border-danger'}`}
									onPress={() => {
										setIsCountryOpen(true)
									}}
								>
									{country ?
										<Text className='text-foreground'>
											{`${flag[country.code]} ${country.dial}`}
										</Text>
									:	<IconSymbol
											color={invalid.phone ? danger : muted}
											name={`chevron.${isCountryOpen ? 'up' : 'down'}`}
											size={16}
										/>
									}
								</Pressable>
							</InputGroup.Prefix>
							<InputGroup.Input
								ref={phoneRef}
								onSubmitEditing={() => passwordRef.current?.focus()}
								returnKeyType='next'
								placeholder={t('phone')}
								keyboardType='number-pad'
								value={phone}
								onBlur={() => {
									handleValid(phone.length > 0, 'phone')
									handleValid(country !== null, 'country')
								}}
								onChangeText={self => {
									setForm(form => ({ ...form, phone: self }))
									handleValid(self.length > 0, 'phone')
								}}
								isInvalid={invalid.phone || invalid.country}
							/>
						</InputGroup>
						<FieldError isInvalid={invalid.country}>
							{t('country_code_error')}
						</FieldError>
					</View>

					<InputGroup>
						<InputGroup.Prefix isDecorative>
							<IconSymbol color={muted} name='lock.fill' size={16} />
						</InputGroup.Prefix>
						<InputGroup.Input
							ref={passwordRef}
							returnKeyType='done'
							placeholder={t('password')}
							autoCapitalize='none'
							autoCorrect={false}
							secureTextEntry={!isPasswordVisible}
							value={password}
							onBlur={() => {
								handleValid(isValidPassword(password), 'password')
							}}
							onChangeText={self => {
								setForm(form => ({ ...form, password: self }))
								handleValid(isValidPassword(self), 'password')
							}}
							isInvalid={invalid.password}
						/>
						<InputGroup.Suffix>
							<Pressable
								hitSlop={20}
								onPress={() => {
									setIsPasswordVisible(!isPasswordVisible)
								}}
							>
								<IconSymbol
									size={16}
									name={`eye.${isPasswordVisible ? 'slash.' : ''}fill`}
									color={muted}
								/>
							</Pressable>
						</InputGroup.Suffix>
					</InputGroup>
					{isSignup && (
						<FieldError isInvalid={invalid.password}>
							{t('password_short')}
						</FieldError>
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
							|| invalid.phone
							|| invalid.country
							|| invalid.password
							|| (typeof nameLength === 'number' && invalid.name)
							|| password.length < 0
							|| phone.length < 0
							|| name.length < 0
							|| country === null
						}
					>
						<Button.Label className='dark:text-background text-foreground'>
							{authLabel}
						</Button.Label>
					</Button>
				</View>

				<Modal
					visible={isCountryOpen}
					transparent
					animationType='slide'
					onRequestClose={() => {
						setIsCountryOpen(false)
						handleValid(country !== null, 'country')
					}}
				>
					<Pressable
						style={{ flex: 1 }}
						onPress={() => {
							setIsCountryOpen(false)
							handleValid(country !== null, 'country')
						}}
					/>
					<View className='h-1/2 bg-segment'>
						<FlatList
							data={countries}
							keyExtractor={countryItem => countryItem.code}
							renderItem={({ item: countryItem }) => (
								<>
									<Pressable
										className='flex flex-row items-center gap-3 p-4 active:bg-muted'
										onPress={() => {
											setForm(form => ({ ...form, country: countryItem }))
											setIsCountryOpen(false)
											handleValid(true, 'country')
										}}
									>
										<Text>{flag[countryItem.code]}</Text>
										<Text className='text-foreground'>{countryItem.dial}</Text>
										<Text className='text-foreground'>{countryItem.name}</Text>
									</Pressable>
									<Separator className='w-full h-px' orientation='vertical' />
								</>
							)}
						/>
					</View>
				</Modal>

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

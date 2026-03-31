import { IconSymbol } from '@/components/ui/icon-symbol'
import countries from '@/lib/countries.json' with { type: 'json' }
import { flag, raise } from '@/lib/utils'
import { type Href, router } from 'expo-router'
import {
	Button,
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
import type { TextInput } from 'react-native'
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
	const muted = useThemeColor('muted')
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

	// eslint-disable-next-line max-statements
	const handleAuth = async () => {
		if (
			typeof nameLength === 'number'
			&& (!/^[\p{L}\s]+$/u.test(name) || name.length <= nameLength)
		) {
			toast.show(t('name_error'))
			return
		}
		if (country === null) {
			toast.show(t('country_code_error'))
			return
		}
		if (
			typeof passwordLength === 'number'
			&& password.length < passwordLength
		) {
			toast.show(t('password_short'))
			return
		}
		setLoading(true)
		await auth(`${country.dial}${phone}`, password, name)
		setLoading(false)
	}

	const isSignup =
		typeof passwordLength === 'number'
		&& typeof nameLength === 'number'
		&& exMethod === '/signin'

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
									onChangeText={self => {
										setForm(form => ({ ...form, name: self }))
									}}
								/>
							</InputGroup>
						</View>
					)}
					<View className='flex gap-2'>
						<InputGroup>
							<InputGroup.Prefix className='px-0'>
								<Pressable
									className='flex-1 w-full px-4 justify-center'
									onPress={() => {
										setIsCountryOpen(true)
									}}
								>
									{country ?
										<Text className='text-foreground'>
											{`${flag[country.code]} ${country.dial}`}
										</Text>
									:	<IconSymbol
											color={muted}
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
								onChangeText={self => {
									setForm(form => ({ ...form, phone: self }))
								}}
							/>
						</InputGroup>
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
							onChangeText={self => {
								setForm(form => ({ ...form, password: self }))
							}}
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
							|| (typeof nameLength === 'number' && name.length === 0)
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
					}}
				>
					<Pressable
						style={{ flex: 1 }}
						onPress={() => {
							setIsCountryOpen(false)
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

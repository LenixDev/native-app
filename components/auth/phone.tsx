import { flag } from '@/lib/utils'
import { InputGroup, useThemeColor } from 'heroui-native'
import { t } from 'i18next'
import { Pressable, Text } from 'react-native'
import { IconSymbol } from '../ui/icon-symbol'
import type { Country } from '@/types'

export const PhoneInput = ({
	onCodeSelect,
	country,
	isCountryOpen,
	phone,
	onChange,
	...props
}: Record<string, unknown> & {
	onCodeSelect: () => void
	country: Country[number] | null
	isCountryOpen: boolean
	phone: string
	onChange: (value: string) => void
}) => {
	const muted = useThemeColor('muted')
	return (
		<InputGroup>
			<InputGroup.Prefix className='px-0'>
				<Pressable
					className='flex-1 w-full px-4 justify-center'
					onPress={onCodeSelect}
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
				returnKeyType='next'
				placeholder={t('phone')}
				keyboardType='number-pad'
				value={phone}
				onChangeText={onChange}
				{...props}
			/>
		</InputGroup>
	)
}

import { flag } from '@/lib/utils'
import { InputGroup, useThemeColor } from 'heroui-native'
import { t } from 'i18next'
import { Pressable, Text } from 'react-native'
import { IconSymbol } from '../ui/icon-symbol'
import type { Country } from '@/types'
import { useIsRTL } from '@/hooks/use-rtl'

const Codes = ({ onCodeSelect, country, isCountryOpen }: {
	onCodeSelect: () => void
	country: Country[number] | null
	isCountryOpen: boolean
}) => {
	const muted = useThemeColor('muted')
	return (
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
	)
}

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
	const isRtl = useIsRTL()
	return (
		<InputGroup>
			{isRtl ? 
				<InputGroup.Suffix className='px-0'>
					<Codes {...{ onCodeSelect, country, isCountryOpen }} />
				</InputGroup.Suffix>
			: <InputGroup.Prefix className='px-0'>
				<Codes {...{ onCodeSelect, country, isCountryOpen }} />
			</InputGroup.Prefix>}
			<InputGroup.Input
				textAlign={isRtl ? 'right' : 'left'}
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

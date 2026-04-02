import { InputGroup, useThemeColor } from 'heroui-native'
import { t } from 'i18next'
import { Pressable } from 'react-native'
import { IconSymbol } from '../ui/icon-symbol'
import { useState } from 'react'
import { useIsRTL } from '@/hooks/use-rtl'

const Eye = ({
	isVisible,
	onPress,
}: {
	isVisible: boolean
	onPress: () => void
}) => {
	const muted = useThemeColor('muted')
	return (
		<Pressable hitSlop={20} {...{ onPress }}>
			<IconSymbol
				size={16}
				name={`eye.${isVisible ? 'slash.' : ''}fill`}
				color={muted}
			/>
		</Pressable>
	)
}

export const PasswordInput = ({
	...prop
}: Record<string, unknown> & { onChangeText: (text: string) => void }) => {
	const muted = useThemeColor('muted')
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)
	const isRtl = useIsRTL()

	return (
		<InputGroup>
			<InputGroup.Prefix isDecorative={!isRtl}>
				{isRtl ?
					<Eye
						isVisible={isPasswordVisible}
						onPress={() => {
							setIsPasswordVisible(!isPasswordVisible)
						}}
					/>
				:	<IconSymbol color={muted} name='lock.fill' size={16} />}
			</InputGroup.Prefix>
			<InputGroup.Input
				textAlign={isRtl ? 'right' : 'left'}
				returnKeyType='done'
				placeholder={t('password')}
				autoCapitalize='none'
				autoCorrect={false}
				secureTextEntry={!isPasswordVisible}
				{...prop}
			/>
			<InputGroup.Suffix>
				{isRtl ?
					<IconSymbol color={muted} name='lock.fill' size={16} />
				:	<Eye
						isVisible={isPasswordVisible}
						onPress={() => {
							setIsPasswordVisible(!isPasswordVisible)
						}}
					/>
				}
			</InputGroup.Suffix>
		</InputGroup>
	)
}

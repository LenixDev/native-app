import { InputGroup, useThemeColor } from "heroui-native"
import { t } from "i18next"
import { Pressable } from "react-native"
import { IconSymbol } from "../ui/icon-symbol"
import { useState } from "react"

export const PasswordInput = ({ ...prop }: Record<string, unknown> & { onChangeText: (text: string) => void}) => {
  const muted = useThemeColor('muted')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  
  return (
    <InputGroup>
      <InputGroup.Prefix isDecorative>
        <IconSymbol color={muted} name='lock.fill' size={16} />
      </InputGroup.Prefix>
      <InputGroup.Input
        returnKeyType='done'
        placeholder={t('password')}
        autoCapitalize='none'
        autoCorrect={false}
        secureTextEntry={!isPasswordVisible}
        {...prop}
      />
      <InputGroup.Suffix>
        <Pressable
          hitSlop={20}
          onPress={() => {
            setIsPasswordVisible(!isPasswordVisible)
          } }
        >
          <IconSymbol
            size={16}
            name={`eye.${isPasswordVisible ? 'slash.' : ''}fill`}
            color={muted} />
        </Pressable>
      </InputGroup.Suffix>
    </InputGroup>
  )
}
import { raise } from "@/lib/utils"
import { Surface, RadioGroup, Switch, Label, Radio, Separator, ListGroup, useThemeColor, BottomSheet } from "heroui-native"
import { View, Text } from "react-native"
import { IconSymbol } from "./ui/icon-symbol"
import type { Lang, Theme } from "@/types"
import { useChangeLang } from "@/hooks/use-change-lang"
import { useIsRTL, useRTL } from "@/hooks/use-rtl"
import { useState } from "react"
import { useTranslation } from "react-i18next"

// eslint-disable-next-line max-lines-per-function
export const Appearance = () => {
  const [theme, setTheme] = useState<Theme>('system')
  const [reduceMotion, setReduceMotion] = useState(false)
  const changeLang = useChangeLang()
  const foreground = useThemeColor('foreground')
  const isRtl = useIsRTL()
  const rtl = useRTL()
  const { t, i18n } = useTranslation()
  return (
    <>
      <BottomSheet.Title className={`mb-6 ${rtl('text-right')}`}>
        {t('appearance')}
      </BottomSheet.Title>
      <View className='gap-6'>
        <View className='gap-2' style={{ direction: isRtl }}>
          <Text className={`text-sm text-muted ml-1 ${rtl('text-left')}`}>{t('theme')}</Text>
          <Surface>
            <RadioGroup
              value={theme}
              onValueChange={self => { setTheme(self) }}
            >
              <RadioGroup.Item value={'light' satisfies Theme}>
                <Label>{t('light')}</Label>
                <Radio />
              </RadioGroup.Item>
              <Separator className='my-1' />
              <RadioGroup.Item value={'dark' satisfies Theme}>
                <Label>{t('dark')}</Label>
                <Radio />
              </RadioGroup.Item>
              <Separator className='my-1' />
              <RadioGroup.Item value={'system' satisfies Theme}>
                <Label>{t('system')}</Label>
                <Radio />
              </RadioGroup.Item>
            </RadioGroup>
          </Surface>
        </View>

        <View className='gap-2' style={{ direction: isRtl }}>
          <Text className={`text-sm text-muted ml-1 ${rtl('text-left')}`}>{t('language')}</Text>
          <Surface>
            <RadioGroup
              value={i18n.language}
              onValueChange={self => { changeLang(self).catch(raise) }}
            >
              <RadioGroup.Item value={'en' satisfies Lang}>
                <Label>🇺🇸 English</Label>
                <Radio />
              </RadioGroup.Item>
              <Separator className='my-1' />
              <RadioGroup.Item value={'ar' satisfies Lang}>
                <Label>🇸🇦 العربية</Label>
                <Radio />
              </RadioGroup.Item>
              <Separator className='my-1' />
              <RadioGroup.Item value={'es' satisfies Lang}>
                <Label>🇪🇸 Español</Label>
                <Radio />
              </RadioGroup.Item>
            </RadioGroup>
          </Surface>
        </View>

        <View className='gap-2' style={{ direction: isRtl }}>
          <Text className={`text-sm text-muted ml-1 ${rtl('text-left')}`}>
            {t('reduce_motion')}
          </Text>
          <ListGroup>
            <ListGroup.Item>
              <ListGroup.ItemPrefix>
                <IconSymbol name='bolt.slash' size={20} color={foreground} />
              </ListGroup.ItemPrefix>
              <ListGroup.ItemContent>
                <ListGroup.ItemTitle className={rtl('text-left')}>
                  {t('reduce_motion')}
                </ListGroup.ItemTitle>
              </ListGroup.ItemContent>
              <ListGroup.ItemSuffix>
                <Switch
                  isSelected={reduceMotion}
                  onSelectedChange={setReduceMotion} />
              </ListGroup.ItemSuffix>
            </ListGroup.Item>
          </ListGroup>
        </View>
      </View>
    </>
  )
}
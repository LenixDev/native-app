import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol'
import { useToggleLang } from '@/hooks/use-toggle-lang'
import { raise } from '@/lib/utils'
import { signout } from '@/services/auth'
import { router } from 'expo-router'
import { Button, ListGroup, Separator, useThemeColor, useToast } from 'heroui-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

const ListItem = ({
  icon, title, context
}: {
  icon: IconSymbolName, title: string, context: string
}) => {
  const foreground = useThemeColor('foreground')
    return (
      <ListGroup.Item>
        <ListGroup.ItemPrefix>
          <IconSymbol
            name={icon}
            size={22}
            color={foreground} />
        </ListGroup.ItemPrefix>
        <ListGroup.ItemContent>
          <ListGroup.ItemTitle>{title}</ListGroup.ItemTitle>
          <ListGroup.ItemDescription>
            {context}
          </ListGroup.ItemDescription>
        </ListGroup.ItemContent>
        <ListGroup.ItemSuffix />
      </ListGroup.Item>
    )
  }

// TODO:
// - theme,
// - lang selection not toggle,
// - change password,
// - change name,
// - change email,
// - delete account,
// - switch account,
// - UI settings(animation on off, colors, fonts, sizes, dark light mode)
// - logout from selected devices
// - Generate memory from chat history to improve response quality
// - decrease conversation by deleting unused topics in tthe same chat session
// - help
// eslint-disable-next-line max-lines-per-function
export default function Tab() {
  const { i18n, t } = useTranslation()
  const changeLang = useToggleLang()
  const { toast } = useToast()

  return (
    <View className="flex justify-evenly h-full px-5">
      <Button
        onPress={() => {
          changeLang().catch(raise)
        }}
      >
        {i18n.language === 'en' ? 'العربية' : 'English'}
      </Button>
      <Text className="text-sm text-muted mb-2 ml-2">Account</Text>
      <ListGroup className="mb-6">
        <ListItem icon='person' title='Personal Info' context='Name, email, phone number' />
        <Separator className="mx-4" />
        <ListItem icon='person' title='Payment Methods' context='Visa ending in 4829' />
      </ListGroup>
      <Text className="text-sm text-muted mb-2 ml-2">Preferences</Text>
      <ListGroup>
        <ListItem icon='person' title='Appearance' context='Theme, font size, display' />
        <Separator className="mx-4" />
        <ListItem icon='person' title='Notifications' context='Alerts, sounds, badges' />
      </ListGroup>
      <Button
        variant="danger-soft"
        onPress={() => {
          signout().then(([success, response]) => {
            if (!success) {
              toast.show(response)
              return
            }
            router.replace('/signin')
            toast.show(t("signout_success"))
          }).catch(raise)
        }}
      >
        {t('signout')}
      </Button>
    </View>
  )
}

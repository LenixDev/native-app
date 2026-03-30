import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol'
import { useToggleLang } from '@/hooks/use-toggle-lang'
import { raise } from '@/lib/utils'
import { signout } from '@/services/auth'
import { router } from 'expo-router'
import { BottomSheet, Button, Description, ListGroup, PressableFeedback, Separator, useThemeColor, useToast } from 'heroui-native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

const ListItem = ({
  icon, title, context, onPress
}: {
  icon: IconSymbolName, title: string, context: string, onPress?: () => void
}) => {
  const foreground = useThemeColor('foreground')
  return (
    <PressableFeedback animation={false} onPress={onPress}>
      <PressableFeedback.Scale>
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
      </PressableFeedback.Scale>
      <PressableFeedback.Ripple />
    </PressableFeedback>
  )
}

const BottomModal = ({
  children, open, setOpen
}: {
  children: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
}) => (
  <BottomSheet isOpen={open} onOpenChange={setOpen}>
    <BottomSheet.Portal>
      <BottomSheet.Overlay />
      <BottomSheet.Content>
        {children}
      </BottomSheet.Content>
    </BottomSheet.Portal>
  </BottomSheet>
)

// TODO:
// - theme,
// - lang selection not toggle,
// - Generate memory from chat history to improve response quality
// - decrease conversation by deleting unused topics in tthe same chat session
// - help
// eslint-disable-next-line max-lines-per-function
export default function Tab() {
  const { i18n, t } = useTranslation()
  const changeLang = useToggleLang()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  return (
    <View className="flex justify-between h-full p-5">
      {/* <Button
        onPress={() => {
          changeLang().catch(raise)
        }}
      >
        {i18n.language === 'en' ? 'العربية' : 'English'}
      </Button> */}
      <View className="flex-1 py-10">
        <Text className="text-2xl">Preferences</Text>
        <Description>Manage your preferences</Description>
      </View>
      <ListGroup className="flex-2 p-0">
        <ListItem icon='person' title='Account' context='Name, phone, password, email, devices, deletion' />
        <Separator className="mx-4" />
        <ListItem onPress={() => { setOpen(true); }} icon='pencil' title='Appearance' context='Theme, language, font size, font style, display animations' />
        <Separator className="mx-4" />
        <ListItem icon='cpu' title='AI' context='Memory management, Credits' />
      </ListGroup>
      <View className="flex-1 flex justify-end">
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
      <BottomModal {...{
        open,
        setOpen
      }}>
        <View className="">
          
        </View>
      </BottomModal>
    </View>
  )
}
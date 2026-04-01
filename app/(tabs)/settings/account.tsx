import { ModalProvider } from "@/components/auth/countries";
import { PasswordInput } from "@/components/auth/password";
import { PhoneInput } from "@/components/auth/phone";
import { supabase } from "@/lib/supabase";
import { isValidPassword, raise } from "@/lib/utils";
import type { Country } from "@/types";
import { Button, Description, Dialog, Label, Separator, Surface, TextField, useToast } from "heroui-native";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const DialogProvider = ({ 
  isOpen, setIsOpen, children 
}: { 
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  children: ReactNode 
}) => (
  <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog>
)

// eslint-disable-next-line max-lines-per-function
export default function Page() {
  const { toast } = useToast()
  const { t } = useTranslation()

  const [isDialogOn, setIsDialogOn] = useState(false)
  const [isCountryOpen, setIsCountryOpen] = useState(false)

  const [operation, setOperation] = useState<'password' | 'phone' | 'signout' | 'deletion'>('phone')
  const [{ current_password, country, ...credentials }, setCredentials] = useState<
    Record<'country', Country[number] | null>
    & Record<'phone' | 'password' | 'current_password', string>
  >({
    password: '',
    phone: '',
    country: null,
    current_password: ''
  })
  
  const handleUpdate = (type: 'password' | 'phone') => {
    supabase.auth.updateUser({ [type]: credentials[type], current_password }).then(({ error }) => {
      if (error) {
        toast.show(error.message)
        return
      }
      toast.show(t('account_updated'))
      setIsDialogOn(false)
    }).catch(raise)
  }

  const handleSignout = () => {
    supabase.auth.signOut({ scope: 'others' }).then(({ error }) => {
      if (error) {
        toast.show(error.message)
        return
      }
      toast.show(t('signout_success'))
      setIsDialogOn(false)
    }).catch(raise)
  }

  const handleDeletion = () => {
    supabase.auth.admin.deleteUser('', true).then(({ error }) => {
      if (error) {
        toast.show(error.message)
        return
      }
      toast.show(t('account_deleted'))
      setIsDialogOn(false)
    }).catch(raise)
  }

  return (
    <>
      <KeyboardAwareScrollView  showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center px-3 gap-8 my-5 mt-20">
          <View>
            <Text className="text-2xl mb-2">{t("phone")}</Text>
            <Surface className="gap-5">
              <TextField>
                <Label>{t("new_phone")}</Label>
                <PhoneInput
                  {...{ isCountryOpen, country }}
                  onCodeSelect={() => {
                    setIsCountryOpen(true)
                  }}
                  phone={credentials.phone}
                  onChange={me => { setCredentials(prev => ({ ...prev, phone: me })) }}
                />
                <Description>{t("phone_context")}</Description>
              </TextField>
              <Button variant='tertiary' onPress={() => { setOperation('phone'); setIsDialogOn(true) }}>{t("update")}</Button>
            </Surface>
          </View>
          <Separator />
          <View>
            <Text className="text-2xl mb-2">{t("password")}</Text>
            <Surface className="gap-5">
              <TextField>
                <Label>{t("new_password")}</Label>
                <PasswordInput
                  value={credentials.password}
                  onChangeText={me => { setCredentials(prev => ({ ...prev, password: me })) }}
                />
                <Description>{t("password_context")}</Description>
              </TextField>
              <Button variant='tertiary' onPress={() => {
                if (!isValidPassword(credentials.password)) {
                  toast.show(t("password_short"))
                  return
                }
                setOperation('password')
                setIsDialogOn(true)
                Keyboard.dismiss()
              }}>{t("update")}</Button>
            </Surface>
          </View>
          <Separator />
          <Button variant="outline" onPress={() => { setOperation('signout'); setIsDialogOn(true) }}>{t("signout_others")}</Button>
          <Button variant="danger-soft" onPress={() => { setOperation('deletion'); setIsDialogOn(true) }}>{t("delete_account")}</Button>
        </View>
      </KeyboardAwareScrollView>
      <DialogProvider isOpen={isDialogOn} setIsOpen={setIsDialogOn}>
        <View className="gap-5">
          <Dialog.Title>
            {operation === 'phone' && t("are_you_sure")}
            {operation === 'password' && t("is_it_you")}
            {operation === 'signout' && t("are_you_sure")}
            {operation === 'deletion' && t("are_you_sure")}
          </Dialog.Title>
          <TextField>
            {/* eslint-disable-next-line no-nested-ternary */}
            {operation === 'password' ? (
              <>
                <Label>{t('current_password')}</Label>
                <PasswordInput
                  value={current_password}
                  onChangeText={me => {
                    setCredentials(prev => ({ ...prev, current_password: me }))
                  }}
                />
                <Description>{t('current_password_context')}</Description>
              </>
            ) : operation === 'deletion' ? (
              <Description>{t('this_ereversable')}</Description>
            ) : operation === 'signout' && (
              <Description>{t('signout_context')}</Description>
            )}
          </TextField>
          <Button
            onPress={() => {
              if (operation === 'phone' || operation === 'password') handleUpdate(operation)
              else if (operation === 'signout') handleSignout()
              else handleDeletion()
            }}
            variant={operation === 'deletion' || operation === 'signout' ? 'danger' : 'primary'}
          >
            {/* eslint-disable-next-line no-nested-ternary */}
            {operation === 'phone' || operation === 'password'
            ? t("save")
            : operation === 'signout' ? t("signout") : t("delete")}
          </Button>
        </View>
      </DialogProvider>
      <ModalProvider
        visible={isCountryOpen}
        onDismiss={() => { setIsCountryOpen(false) }}
        onSelect={(countryItem: Country[number]) => {
          setCredentials(prev => ({ ...prev, country: countryItem }))
        }}
      />
    </>
  )
}
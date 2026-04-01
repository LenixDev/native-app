import { PasswordInput } from "@/components/auth/password";
import { supabase } from "@/lib/supabase";
import { raise } from "@/lib/utils";
import { Button, Description, Dialog, FieldError, Input, Label, Separator, Surface, TextField, useToast } from "heroui-native";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
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
  const [isOpen, setIsOpen] = useState(false)

  const [operation, setOperation] = useState<'password' | 'phone' | 'signout' | 'deletion'>('phone')
  const [{ current_password, ...credentials }, setCredentials] = useState({
    password: '',
    phone: '',
    current_password: ''
  })
  
  const handleUpdate = (type: 'password' | 'phone') => {
    supabase.auth.updateUser({ [type]: credentials[type], current_password }).then(({ error }) => {
      if (error) {
        toast.show(error.message)
        return
      }
      toast.show(t('account_updated'))
      setIsOpen(false)
    }).catch(raise)
  }

  const handleSignout = () => {
    supabase.auth.signOut({ scope: 'others' }).then(({ error }) => {
      if (error) {
        toast.show(error.message)
        return
      }
      toast.show(t('signout_success'))
      setIsOpen(false)
    }).catch(raise)
  }

  const handleDeletion = () => {
    supabase.auth.admin.deleteUser('', true).then(({ error }) => {
      if (error) {
        toast.show(error.message)
        return
      }
      toast.show(t('account_deleted'))
      setIsOpen(false)
    }).catch(raise)
  }

  return (
    <>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center px-3 gap-8 my-5 mt-20">
          <View>
            <Text className="text-2xl mb-2">{t("phone")}</Text>
            <Surface className="gap-5">
              <TextField>
                <Label>{t("new_phone")}</Label>
                <Input value={credentials.phone} onChangeText={me => { setCredentials(prev => ({ ...prev, phone: me })) }} />
                <Description>{t("phone_context")}</Description>
                <FieldError></FieldError>
              </TextField>
              <Button variant='tertiary' onPress={() => { setOperation('phone'); setIsOpen(true) }}>{t("update")}</Button>
            </Surface>
          </View>
          <Separator />
          <View>
            <Text className="text-2xl mb-2">{t("password")}</Text>
            <Surface className="gap-5">
              <TextField>
                <Label>{t("new_password")}</Label>
                <Input
                  value={credentials.password}
                  onChangeText={me => { setCredentials(prev => ({ ...prev, password: me })) }}
                  autoCapitalize="none"
                />
                <Description>{t("password_context")}</Description>
                <FieldError></FieldError>
              </TextField>
              <Button variant='tertiary' onPress={() => { setOperation('password'); setIsOpen(true) }}>{t("update")}</Button>
            </Surface>
          </View>
          <Separator />
          <Button variant="outline" onPress={() => { setOperation('signout'); setIsOpen(true) }}>{t("signout_others")}</Button>
          <Button variant="danger-soft" onPress={() => { setOperation('deletion'); setIsOpen(true) }}>{t("delete_account")}</Button>
        </View>
      </KeyboardAwareScrollView>
      <DialogProvider isOpen={isOpen} setIsOpen={setIsOpen}>
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
    </>
  )
}
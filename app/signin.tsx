import { signin } from "@/services/auth";
import { router } from "expo-router";
import { useToast } from "heroui-native";
import { t } from "i18next";
import { Auth } from "../components/auth";

export default function Page() {
  const { toast } = useToast()

  const auth = async (phone: string, password: string) => {
    const { error } = await signin(phone, password)
    if (error) {
      if (error.code === 'phone_not_confirmed') router.replace(`/verify?phone=${encodeURIComponent(phone)}`)
      else toast.show(error.message)
      return
    }
    toast.show(t('signin_success'))
    router.replace('/(tabs)/home')
  }
  return (
    <Auth
      {...{
        auth,
        authLabel: t('signin'),
        exMethodLabel: t('signup'),
        exMethod: '/signup'
      }}
    />
  )
}
import { Button, Input } from "heroui-native";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Text, View } from "react-native";

export default function Page() {
  const { t } = useTranslation()
  return (
    <View className="flex h-full items-center w-screen py-5">
      <View className="h-9/10 flex justify-center items-center w-full gap-5">
        <Text className="text-4xl">
          {t("whats_ur_name")}
        </Text>
        <KeyboardAvoidingView behavior="padding" className="flex items-center w-full">
          <Input
            className="w-3/5"
            placeholder={t("fake_name")}
          />
        </KeyboardAvoidingView>
      </View>
      <View className="h-1/10 w-4/5">
        <Button className="w-full">{t("finish")}</Button>
      </View>
    </View>
  )
}

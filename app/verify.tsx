import { raise } from "@/lib/utils";
import { verify } from "@/services/auth";
import { navigate } from "expo-router/build/global-state/routing";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { InputOTP, type InputOTPRef } from "heroui-native/input-otp";
import { useToast } from "heroui-native/toast";
import { useRef } from "react";
import { KeyboardAvoidingView } from "react-native";

export default function Page() {
  const ref = useRef<InputOTPRef>(null);
  const { toast } = useToast()
  const { phone } = useLocalSearchParams<{ phone: string }>()

  const onComplete = async (code: string) => {
    const [success, response] = await verify(phone, code)
    if (!success) {
      toast.show(response)
      ref.current?.clear()
      return
    }
    toast.show('Verified')
    navigate('/(tabs)/home')
  };
  return (
    <KeyboardAvoidingView behavior="padding" className="flex items-center justify-center w-full h-full">
      <InputOTP ref={ref} maxLength={6} onComplete={self => { onComplete(self).catch(raise) }}>
        <InputOTP.Group>
          <InputOTP.Slot index={0} />
          <InputOTP.Slot index={1} />
          <InputOTP.Slot index={2} />
        </InputOTP.Group>
        <InputOTP.Separator />
        <InputOTP.Group>
          <InputOTP.Slot index={3} />
          <InputOTP.Slot index={4} />
          <InputOTP.Slot index={5} />
        </InputOTP.Group>
      </InputOTP>
    </KeyboardAvoidingView>
  )
}
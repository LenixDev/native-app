import { InputOTP, type InputOTPRef } from "heroui-native/input-otp";
import { useRef } from "react";

export default function Page() {
  const ref = useRef<InputOTPRef>(null);
  const onComplete = (code: string) => {
    console.log('OTP completed:', code);
    setTimeout(() => {
      ref.current?.clear();
    }, 1000);
  };
  return (
    <InputOTP ref={ref} maxLength={6} onComplete={onComplete}>
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
  )
}
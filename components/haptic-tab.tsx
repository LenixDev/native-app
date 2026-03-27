import { raise } from '@/lib/utils'
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import { PlatformPressable } from '@react-navigation/elements'
import * as Haptics from 'expo-haptics'

export const HapticTab = (props: BottomTabBarButtonProps) => (
  <PlatformPressable
    {...props}
    onPressIn={(ev) => {
      if (process.env.EXPO_OS === 'ios')
        // Add a soft haptic feedback when pressing down on the tabs.
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          .then(() => {
            props.onPressIn?.(ev)
          })
          .catch(raise)
    }}
  />
)

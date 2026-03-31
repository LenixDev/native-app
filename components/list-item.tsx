import { useIsRTL, useRTL } from "@/hooks/use-rtl"
import { useThemeColor, PressableFeedback, ListGroup } from "heroui-native"
import { type IconSymbolName, IconSymbol } from "./ui/icon-symbol"

export const ListItem = ({
  icon,
  title,
  context,
  onPress,
}: {
  icon: IconSymbolName
  title: string
  context: string
  onPress?: () => void
}) => {
  const foreground = useThemeColor('foreground')
  const isRtl = useIsRTL()
  const rtl = useRTL()
  return (
    <PressableFeedback animation={false} onPress={onPress}>
      <PressableFeedback.Scale>
        <ListGroup.Item style={{ direction: isRtl }}>
          <ListGroup.ItemPrefix>
            <IconSymbol name={icon} size={22} color={foreground} />
          </ListGroup.ItemPrefix>
          <ListGroup.ItemContent className={rtl('flex items-start')}>
            <ListGroup.ItemTitle>{title}</ListGroup.ItemTitle>
            <ListGroup.ItemDescription className={rtl('text-left')}>
              {context}
            </ListGroup.ItemDescription>
          </ListGroup.ItemContent>
          <ListGroup.ItemSuffix style={{ transform: rtl('rotate(180deg)') }} />
        </ListGroup.Item>
      </PressableFeedback.Scale>
      <PressableFeedback.Ripple />
    </PressableFeedback>
  )
}
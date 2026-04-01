import { useIsRTL, useRTL } from '@/hooks/use-rtl'
import { ListGroup, PressableFeedback, useThemeColor } from 'heroui-native'
import { type IconSymbolName, IconSymbol } from './ui/icon-symbol'

export const ListItem = ({
	prefix,
	suffix,
	title,
	context,
	onPress,
}: {
	prefix: IconSymbolName
	suffix?: IconSymbolName
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
						<IconSymbol name={prefix} size={22} color={foreground} />
					</ListGroup.ItemPrefix>
					<ListGroup.ItemContent className={rtl('flex items-start')}>
						<ListGroup.ItemTitle>{title}</ListGroup.ItemTitle>
						<ListGroup.ItemDescription className={rtl('text-left')}>
							{context}
						</ListGroup.ItemDescription>
					</ListGroup.ItemContent>
					{suffix && (
						<ListGroup.ItemSuffix style={{ transform: rtl('rotate(180deg)') }}>
							<IconSymbol
								name={suffix}
								size={14}
								color={foreground}
								weight='light'
							/>
						</ListGroup.ItemSuffix>
					)}
				</ListGroup.Item>
			</PressableFeedback.Scale>
			<PressableFeedback.Ripple />
		</PressableFeedback>
	)
}

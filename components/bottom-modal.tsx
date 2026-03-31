import { BottomSheet } from 'heroui-native'

export const BottomModal = ({
	children,
	open,
	setOpen,
}: {
	children: React.ReactNode
	open: boolean
	setOpen: (open: boolean) => void
}) => (
	<BottomSheet isOpen={open} onOpenChange={setOpen}>
		<BottomSheet.Portal>
			<BottomSheet.Overlay />
			<BottomSheet.Content>{children}</BottomSheet.Content>
		</BottomSheet.Portal>
	</BottomSheet>
)

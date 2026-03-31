import { BottomSheet } from 'heroui-native'
import type { ReactNode } from 'react'

export const BottomModal = ({
	children,
	open,
	setOpen,
}: {
	children: ReactNode
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

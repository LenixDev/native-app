import { Dialog } from "heroui-native/dialog"
import { ReactNode } from "react"

export const DialogProvider = ({
	isOpen,
	setIsOpen,
	children,
}: {
	isOpen: boolean
	setIsOpen: (open: boolean) => void
	children: ReactNode
}) => (
	<Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
		<Dialog.Portal>
			<Dialog.Overlay />
			<Dialog.Content>{children}</Dialog.Content>
		</Dialog.Portal>
	</Dialog>
)

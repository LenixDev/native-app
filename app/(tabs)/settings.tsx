import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol'
import { useChangeLang } from '@/hooks/use-change-lang'
import { raise } from '@/lib/utils'
import { signout } from '@/services/auth'
import type { Lang } from '@/types'
import { router } from 'expo-router'
import {
	BottomSheet,
	Button,
	Description,
	Label,
	ListGroup,
	PressableFeedback,
	Radio,
	RadioGroup,
	Separator,
	Surface,
	Switch,
	useThemeColor,
	useToast,
} from 'heroui-native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

type Theme = 'light' | 'dark' | 'system'

// faq accordittion
// chat avatart
// other settings checkbox
// controlfield
// menu
// radio
// scroll shadow chat

// surface chat
// switch

// TODO:
// - theme,
// - lang selection not toggle,
// - Generate memory from chat history to improve response quality
// - decrease conversation by deleting unused topics in tthe same chat session
// - help

const ListItem = ({
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
	return (
		<PressableFeedback animation={false} onPress={onPress}>
			<PressableFeedback.Scale>
				<ListGroup.Item>
					<ListGroup.ItemPrefix>
						<IconSymbol name={icon} size={22} color={foreground} />
					</ListGroup.ItemPrefix>
					<ListGroup.ItemContent>
						<ListGroup.ItemTitle>{title}</ListGroup.ItemTitle>
						<ListGroup.ItemDescription>{context}</ListGroup.ItemDescription>
					</ListGroup.ItemContent>
					<ListGroup.ItemSuffix />
				</ListGroup.Item>
			</PressableFeedback.Scale>
			<PressableFeedback.Ripple />
		</PressableFeedback>
	)
}

const BottomModal = ({
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

// eslint-disable-next-line max-lines-per-function
export default function Tab() {
	const { t, i18n } = useTranslation()
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const [theme, setTheme] = useState<Theme>('system')
	const [reduceMotion, setReduceMotion] = useState(false)
	const changeLang = useChangeLang()
	const foreground = useThemeColor('foreground')

	const handleSignout = () => {
		signout()
			.then(([success, response]) => {
				if (!success) {
					toast.show(response)
					return
				}
				router.replace('/signin')
				toast.show(t('signout_success'))
			})
			.catch(raise)
	}

	return (
		<View className='flex justify-between h-full p-5'>
			<View className='flex-1 py-10'>
				<Text className='text-4xl text-foreground'>{t('preferences')}</Text>
				<Description>{t('manage_preferences')}</Description>
			</View>

			<ListGroup className='flex-2 p-0'>
				<ListItem
					icon='person'
					title={t('account')}
					context={t('account_context')}
				/>
				<Separator className='mx-4' />
				<ListItem
					onPress={() => {
						setOpen(true)
					}}
					icon='pencil'
					title={t('appearance')}
					context={t('appearance_context')}
				/>
				<Separator className='mx-4' />
				<ListItem icon='cpu' title={t('ai')} context={t('ai_context')} />
			</ListGroup>

			<View className='flex-1 flex justify-end'>
				<Button variant='danger-soft' onPress={handleSignout}>
					{t('signout')}
				</Button>
			</View>

			<BottomModal open={open} setOpen={setOpen}>
				<BottomSheet.Title className='mb-6'>
					{t('appearance')}
				</BottomSheet.Title>

				<View className='gap-6'>
					<View className='gap-2'>
						<Text className='text-sm text-muted ml-1'>{t('theme')}</Text>
						<Surface>
							<RadioGroup
								value={theme}
								onValueChange={self => {
									setTheme(self)
								}}
							>
								<RadioGroup.Item value={'light' satisfies Theme}>
									<Label>{t('light')}</Label>
									<Radio />
								</RadioGroup.Item>
								<Separator className='my-1' />
								<RadioGroup.Item value={'dark' satisfies Theme}>
									<Label>{t('dark')}</Label>
									<Radio />
								</RadioGroup.Item>
								<Separator className='my-1' />
								<RadioGroup.Item value={'system' satisfies Theme}>
									<Label>{t('system')}</Label>
									<Radio />
								</RadioGroup.Item>
							</RadioGroup>
						</Surface>
					</View>

					<View className='gap-2'>
						<Text className='text-sm text-muted ml-1'>{t('language')}</Text>
						<Surface>
							<RadioGroup
								value={i18n.language}
								onValueChange={self => {
									changeLang(self).catch(raise)
								}}
							>
								<RadioGroup.Item value={'en' satisfies Lang}>
									<Label>🇺🇸 English</Label>
									<Radio />
								</RadioGroup.Item>
								<Separator className='my-1' />
								<RadioGroup.Item value={'ar' satisfies Lang}>
									<Label>🇸🇦 العربية</Label>
									<Radio />
								</RadioGroup.Item>
								<Separator className='my-1' />
								<RadioGroup.Item value={'es' satisfies Lang}>
									<Label>🇪🇸 Español</Label>
									<Radio />
								</RadioGroup.Item>
							</RadioGroup>
						</Surface>
					</View>

					<View className='gap-2'>
						<Text className='text-sm text-muted ml-1'>
							{t('reduce_motion')}
						</Text>
						<ListGroup>
							<ListGroup.Item>
								<ListGroup.ItemPrefix>
									<IconSymbol name='bolt.slash' size={20} color={foreground} />
								</ListGroup.ItemPrefix>
								<ListGroup.ItemContent>
									<ListGroup.ItemTitle>
										{t('reduce_motion')}
									</ListGroup.ItemTitle>
								</ListGroup.ItemContent>
								<ListGroup.ItemSuffix>
									<Switch
										isSelected={reduceMotion}
										onSelectedChange={setReduceMotion}
									/>
								</ListGroup.ItemSuffix>
							</ListGroup.Item>
						</ListGroup>
					</View>
				</View>
			</BottomModal>
		</View>
	)
}

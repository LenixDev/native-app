import { raise } from '@/lib/utils'
import {
	Surface,
	RadioGroup,
	Switch,
	Label,
	Radio,
	Separator,
	ListGroup,
	useThemeColor,
	BottomSheet,
	useToast,
} from 'heroui-native'
import { View, Text } from 'react-native'
import { IconSymbol } from './ui/icon-symbol'
import type { Account, Lang, Theme } from '@/types'
import { useChangeLang } from '@/hooks/use-change-lang'
import { useIsRTL, useRTL } from '@/hooks/use-rtl'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import { useChangeTheme } from '@/hooks/use-change-theme'
import { useToggleMotion } from '@/hooks/use-toggle-motion'

// eslint-disable-next-line max-lines-per-function, max-statements
export const Appearance = () => {
	const isRtl = useIsRTL()
	const rtl = useRTL()

	const { t } = useTranslation()
	const { toast } = useToast()
	const foreground = useThemeColor('foreground')

	const [theme, setTheme] = useState<Theme>('system')
	const [motion, setMotion] = useState(false)
	const [lang, setLang] = useState<Lang>('system')

	const changeLang = useChangeLang()
	const changeTheme = useChangeTheme()
	const toggleMotion = useToggleMotion()

	useEffect(() => {
		supabase.auth
			.getUser()
			.then(({ error: errorUser, data: dataUser }) => {
				if (errorUser) {
					toast.show(errorUser.message)
					return
				}
				supabase
					.from('accounts')
					.select('theme, lang, motion')
					.eq('id', dataUser.user.id)
					.single<Account>()
					.then(({ error, data }) => {
						if (error) {
							toast.show(error.message)
							return
						}
						setTheme(data.theme)
						setMotion(data.motion)
						setLang(data.lang)
					})
			})
			.catch(raise)
	}, [toast])

	const handleTheme = (changedTheme: string) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
		changeTheme(changedTheme as Theme)
			.then(success => {
				if (!success) return
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				setTheme(changedTheme as Theme)
			})
			.catch(raise)
	}

	const handleLang = (changedLang: string) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
		changeLang(changedLang as Lang)
			.then(success => {
				if (!success) return
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				setLang(changedLang as Lang)
			})
			.catch(raise)
	}

	const handleMotion = (changedMotion: Account['motion']) => {
		toggleMotion(changedMotion)
			.then(success => {
				if (!success) return
				setMotion(changedMotion)
			})
			.catch(raise)
	}

	return (
		<>
			<BottomSheet.Title className={`mb-6 ${rtl('text-right')}`}>
				{t('appearance')}
			</BottomSheet.Title>
			<View className='gap-6'>
				<View className='gap-2' style={{ direction: isRtl }}>
					<Text className={`text-sm text-muted ml-1 ${rtl('text-left')}`}>
						{t('theme')}
					</Text>
					<Surface>
						<RadioGroup value={theme} onValueChange={handleTheme}>
							<RadioGroup.Item value={'light' satisfies Theme}>
								<View className='flex-row gap-2'>
									<IconSymbol name='sun.max' size={20} color={foreground} />
									<Label>{t('light')}</Label>
								</View>
								<Radio />
							</RadioGroup.Item>
							<Separator className='my-1' />
							<RadioGroup.Item value={'dark' satisfies Theme}>
								<View className='flex-row gap-2'>
									<IconSymbol name='moon' size={20} color={foreground} />
									<Label>{t('dark')}</Label>
								</View>
								<Radio />
							</RadioGroup.Item>
							<Separator className='my-1' />
							<RadioGroup.Item value={'system' satisfies Theme}>
								<View className='flex-row gap-2'>
									<IconSymbol name='gearshape' size={20} color={foreground} />
									<Label>{t('system')}</Label>
								</View>
								<Radio />
							</RadioGroup.Item>
						</RadioGroup>
					</Surface>
				</View>

				<View className='gap-2' style={{ direction: isRtl }}>
					<Text className={`text-sm text-muted ml-1 ${rtl('text-left')}`}>
						{t('language')}
					</Text>
					<Surface>
						<RadioGroup value={lang} onValueChange={handleLang}>
							<RadioGroup.Item value={'en' satisfies Lang}>
								<View className='flex-row gap-2'>
									<IconSymbol name='globe.americas' size={20} color={foreground} />
									<Label>English</Label>
								</View>
								<Radio />
							</RadioGroup.Item>
							<Separator className='my-1' />
							<RadioGroup.Item value={'ar' satisfies Lang}>
								<View className='flex-row gap-2'>
									<IconSymbol name='globe.asia.australia' size={20} color={foreground} />
									<Label>العربية</Label>
								</View>
								<Radio />
							</RadioGroup.Item>
							<Separator className='my-1' />
							<RadioGroup.Item value={'es' satisfies Lang}>
								<View className='flex-row gap-2'>
									<IconSymbol name='globe.europe.africa' size={20} color={foreground} />
									<Label>Español</Label>
								</View>
								<Radio />
							</RadioGroup.Item>
							<Separator className='my-1' />
							<RadioGroup.Item value={'system' satisfies Lang}>
								<View className='flex-row gap-2'>
									<IconSymbol name='gearshape' size={20} color={foreground} />
									<Label>{t("system")}</Label>
								</View>
								<Radio />
							</RadioGroup.Item>
						</RadioGroup>
					</Surface>
				</View>

				<View className='gap-2' style={{ direction: isRtl }}>
					<Text className={`text-sm text-muted ml-1 ${rtl('text-left')}`}>
						{t('reduce_motion')}
					</Text>
					<ListGroup>
						<ListGroup.Item>
							<ListGroup.ItemPrefix>
								<IconSymbol name='sparkles' size={20} color={foreground} />
							</ListGroup.ItemPrefix>
							<ListGroup.ItemContent>
								<ListGroup.ItemTitle className={rtl('text-left')}>
									{t('reduce_motion')}
								</ListGroup.ItemTitle>
							</ListGroup.ItemContent>
							<ListGroup.ItemSuffix>
								<Switch isSelected={motion} onSelectedChange={handleMotion} />
							</ListGroup.ItemSuffix>
						</ListGroup.Item>
					</ListGroup>
				</View>
			</View>
		</>
	)
}

import countries from '@/lib/countries.json' with { type: 'json' }
import { flag } from '@/lib/utils'
import type { Country } from '@/types'
import { Separator } from 'heroui-native'
import { Modal, Pressable, View, FlatList, Text } from 'react-native'

export const ModalProvider = ({
	visible,
	onSelect,
	onDismiss,
}: {
	visible: boolean
	onSelect: (countryItem: Country[number]) => void
	onDismiss: () => void
}) => (
	<Modal
		visible={visible}
		transparent
		animationType='slide'
		onRequestClose={onDismiss}
	>
		<Pressable style={{ flex: 1 }} onPress={onDismiss} />
		<View className='h-1/2 bg-segment'>
			<FlatList
				data={countries}
				keyExtractor={countryItem => countryItem.code}
				renderItem={({ item: countryItem }) => (
					<>
						<Pressable
							className='flex flex-row items-center gap-3 p-4 active:bg-muted'
							onPress={() => {
								onSelect(countryItem)
								onDismiss()
							}}
						>
							<Text>{flag[countryItem.code]}</Text>
							<Text className='text-foreground'>{countryItem.dial}</Text>
							<Text className='text-foreground'>{countryItem.name}</Text>
						</Pressable>
						<Separator className='w-full h-px' orientation='vertical' />
					</>
				)}
			/>
		</View>
	</Modal>
)

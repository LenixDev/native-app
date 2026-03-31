import { Appearance } from 'react-native'
import { Uniwind } from 'uniwind'

let theme = Appearance.getColorScheme() ?? 'light'

Appearance.addChangeListener(({ colorScheme }) => {
	if (!Uniwind.hasAdaptiveThemes) return
	if (colorScheme) theme = colorScheme
})

export const deviceTheme = () => theme

import { AppState, Platform } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'
import { raise } from './utils'

const supabaseUrl = (() => {
	const url = process.env.EXPO_PUBLIC_SUPABASE_ID
	if (typeof url !== 'string') throw new Error('Missing Supabase ID')
	return `https://${url}.supabase.co`
})()

const supabaseAnonKey = (() => {
	const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
	if (typeof key !== 'string') throw new Error('Missing Supabase Anon Key')
	return key
})()

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		...(Platform.OS !== 'web' && { storage: AsyncStorage }),
		detectSessionInUrl: false,
		lock: processLock,
	},
})

if (Platform.OS !== 'web')
	AppState.addEventListener('change', state => {
		if (state === 'active') supabase.auth.startAutoRefresh().catch(raise)
		else supabase.auth.stopAutoRefresh().catch(raise)
	})

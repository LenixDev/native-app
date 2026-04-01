import type { Database } from './_db'
import countries from '@/lib/countries.json' with { type: 'json' }

export type Lang = Database['public']['Enums']['lang']
export type Theme = Database['public']['Enums']['theme']
export type Account = Database['public']['Tables']['accounts']['Row']
export type Country = typeof countries

export interface Conversation {
	role: 'user' | 'assistant'
	content: string
}

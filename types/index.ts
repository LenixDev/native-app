import type { Database } from "./_db"

export type Lang = Database["public"]['Enums']['lang']
export type Theme = Database["public"]['Enums']['theme']
export type Account = Database["public"]["Tables"]["accounts"]['Row']

export interface Conversation {
	role: 'user' | 'assistant'
	content: string
}

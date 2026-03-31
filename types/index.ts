export type Lang = 'en' | 'ar' | 'es'
export type Theme = 'light' | 'dark' | 'system'

export interface Conversation {
	role: 'user' | 'assistant'
	content: string
}

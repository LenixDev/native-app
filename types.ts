export type Lang = 'en' | 'ar' | 'es'
export type RegisterMethod = 'phone' | 'email'
export type Theme = 'light' | 'dark' | 'system'

export interface Conversation {
	role: 'user' | 'assistant'
	content: string
}

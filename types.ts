export type Lang = 'en' | 'ar' | 'es'
export type RegisterMethod = 'phone' | 'email'

export interface Conversation {
  role: 'user' | 'assistant'
  content: string
}

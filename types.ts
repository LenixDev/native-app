export type Lang = 'en' | 'ar'

export interface Conversation {
  role: 'user' | 'assistant'
  content: string
}
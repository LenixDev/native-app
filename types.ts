export type Lang = 'en' | 'ar'

export interface Conversation {
  role: 'user' | 'ai'
  message: string
}
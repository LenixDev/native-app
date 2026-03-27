export type Lang = 'en' | 'ar'

export interface Conversation {
  sender: 'human' | 'ai'
  message: string
}
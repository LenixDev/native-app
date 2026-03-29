import { type Href, Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type SessionState = 'authenticated' | 'unauthenticated' | 'unverified'

export default function Page() {
  const [session, setSession] = useState<SessionState | null>(null)
  const [phone, setPhone] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: authSession } }) => {
      if (!authSession) {
        setSession('unauthenticated')
        return
      }
      setPhone(authSession.user.phone ?? '')
      if (typeof authSession.user.confirmed_at !== 'string') {
        setSession('unverified')
        return
      }
      setSession('authenticated')
    }).catch(() => {
      setSession('unauthenticated')
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, authSession) => {
      if (!authSession) {
        setSession('unauthenticated')
        return
      }
      setPhone(authSession.user.phone ?? '')
      if (typeof authSession.user.confirmed_at !== 'string') {
        setSession('unverified')
        return
      }
      setSession('authenticated')
    })

    return () => { subscription.unsubscribe() }
  }, [])

  if (session === null) return null

  const ref = () => {
    if (session === 'unauthenticated') return '/signin'
    if (session === 'unverified') return `/verify?phone=${encodeURIComponent(phone)}` as Href
    return '/(tabs)/home'
  }
  return <Redirect href={ref()} />
}
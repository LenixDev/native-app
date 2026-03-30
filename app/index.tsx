import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type Href, Redirect } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { verificationKey } from '@/constants'

export default function Page() {
  const [route, setRoute] = useState<Href | null>(null)

  useEffect(() => {
    const {
      data: { subscription },
      // eslint-disable-next-line max-statements
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setRoute('/(tabs)/home')
        return
      }
      const phone = await AsyncStorage.getItem(verificationKey)
      if (typeof phone === 'string') {
        setRoute(`/verify?phone=${encodeURIComponent(phone)}`)
        return
      }
      if (event === 'INITIAL_SESSION' && !session) {
        setRoute('/signin')
        return
      }
      if (event === 'SIGNED_OUT') {
        setRoute('/signin')
        return
      }
      if (event === 'INITIAL_SESSION' && session) {
        setRoute('/(tabs)/home')
        return
      }
      setRoute('/+not-found')
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (route === null) return null

  return <Redirect href={route} />
}

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Redirect, router } from 'expo-router'
import { raise } from '@/lib/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { verificationKey } from '@/constants'

export default function Page() {
  useEffect(() => {
    // eslint-disable-next-line max-statements
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, authSession) => {
      console.log(event, authSession)
      if (event === 'SIGNED_IN') {
        router.replace('/(tabs)/home')
        return
      }
      const phone = await AsyncStorage.getItem(verificationKey)
      if (typeof phone === 'string') {
        router.replace(`/verify?phone=${encodeURIComponent(phone)}`)
        return
      }
      if (event === 'INITIAL_SESSION') {
        router.replace('/signin')
        return
      }
      if (event === 'SIGNED_OUT') {
        router.replace('/signin')
        return
      }
    })
    return () => { subscription.unsubscribe() }
  }, [])
  
  // return <Redirect href={'/signin'}/>
}
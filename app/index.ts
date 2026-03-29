import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Page() {

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, authSession) => {
      const { access_token: _, ...rest } = authSession
      console.debug(rest, event)
    })
    return () => { subscription.unsubscribe() }
  }, [])
  return (
    <Redirect href={'/signin'}/>
  )
}
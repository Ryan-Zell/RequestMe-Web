import { useQuery } from 'react-query'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { handleSupabaseError } from 'utils/supbase'

export interface LinkInterface {
  id: string
  userId: string
  url: string
  type: 'payment' | 'outside' | 'footer'
}

export default ({ userId }: { userId?: string }) => {
  return useQuery(
    ['links'],
    () =>
      supabaseClient
        .from<LinkInterface>('Link')
        .select('*')
        .eq('userId', userId ?? '')
        .then(handleSupabaseError)
        .then(({ data }) => data),
    {
      enabled: !!userId,
    }
  )
}

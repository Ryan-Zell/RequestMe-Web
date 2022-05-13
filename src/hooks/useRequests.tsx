import { useQuery } from 'react-query'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { handleSupabaseError } from 'utils/supbase'

export interface Request {
  id: string
  order: number,
  userId: string
}[];

export default ({ userId }: { userId?: string }) => {
  return useQuery(
    ['requests'],
    () =>
      supabaseClient
        .from<Request>('Request')
        .select('*')
        .eq('userId', userId ?? '')
        .then(handleSupabaseError)
        .then(({ data }) => data),
    {
      enabled: !!userId,
    }
  )
}

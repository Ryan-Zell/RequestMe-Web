import { useQuery } from 'react-query'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { handleSupabaseError } from 'utils/supbase'

interface UserProfile {
  id: number
  created_at: string
  userId: string
  phone: string
  businessName: string
  tagline: string
  websiteUrl: string
}

export default (userId?: string) => {
  const { user, error } = useUser()

  const userIdNormalized = userId ? userId : user?.id ?? ''

  console.log({ userIdNormalized })
  return useQuery(
    ['user-info'],
    () =>
      supabaseClient
        .from<UserProfile>('UserInfo')
        .select('*')
        .eq('userId', userIdNormalized)
        .single()
        .then(handleSupabaseError)
        .then(({ data }) => data),
    {
      enabled: !!userIdNormalized,
    }
  )
}

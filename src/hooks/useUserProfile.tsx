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

export default () => {
  const { user, error } = useUser()
  return useQuery(
    ['user-info'],
    () =>
      supabaseClient
        .from<UserProfile>('UserInfo')
        .select('*')
        .eq('userId', user?.id ?? '')
        .single()
        .then(handleSupabaseError)
        .then(({ data }) => data),
    {
      enabled: !!user,
    },
  )
}

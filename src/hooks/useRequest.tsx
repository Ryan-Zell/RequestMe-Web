import { useQuery } from 'react-query'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { handleSupabaseError } from 'utils/supbase'





export default ({ requestId }: { requestId?: string }) => {
  return useQuery(
    ['requests', requestId],
    () =>
      supabaseClient
        .from('RequestItem')
        .select('*')
        .eq('requestId', requestId ?? '')
        .then(handleSupabaseError)
        .then(({ data }) => data),
    {
      enabled: !!requestId,
    }
  )
}

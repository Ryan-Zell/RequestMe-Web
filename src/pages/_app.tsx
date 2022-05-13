import 'styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@supabase/supabase-auth-helpers/react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider supabaseClient={supabaseClient}>
        <Component {...pageProps} />
        <Toaster />
      </UserProvider>
    </QueryClientProvider>
  )
}

export default MyApp

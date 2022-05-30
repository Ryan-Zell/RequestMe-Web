import { useUser } from '@supabase/supabase-auth-helpers/react'
import { supabaseClient, getUser } from '@supabase/supabase-auth-helpers/nextjs'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Auth } from '@supabase/ui'
import { useRouter } from 'next/router'

const LoginPage: NextPage = () => {
  const { isLoading, user, error } = useUser()

  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user])

  if (!user)
    return (
      <>
        <div className="h-screen">
          <div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                RequestMe
              </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="flex flex-col px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
                <div className='flex justify-center '>
                  <img
                    className="w-auto h-16"
                    src="/images/logo.png"
                    alt="Workflow"
                  />
                </div>
                <Auth
                  supabaseClient={supabaseClient}
                  socialLayout="horizontal"
                  socialButtonSize="xlarge"
                  redirectTo="/dashboard"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    )

  return <></>
}

export default LoginPage

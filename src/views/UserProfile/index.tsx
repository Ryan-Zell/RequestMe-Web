import useUserProfile from 'hooks/useUserProfile'
import React, { useEffect } from 'react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { toast } from 'react-hot-toast'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { ShareIcon } from '@heroicons/react/solid'
import { useClipboard } from 'use-clipboard-copy'

interface UserProfile {
  id: number
  created_at: string
  userId: string
  phone: string
  businessName: string
  tagline: string
  websiteUrl: string
}

const UserProfile = () => {
  const { data }: { data: UserProfile | undefined } = useUserProfile()
  const { user, error } = useUser()
  const clipboard = useClipboard()

  const { register, reset, handleSubmit } = useForm<Partial<UserProfile>>({
    defaultValues: {
      ...(data && {}),
    },
  })

  useEffect(() => {
    if (data) {
      reset(data)
    }
  }, [data])

  const onSubmit: SubmitHandler<Partial<UserProfile>> = async (
    userProfileData
  ) => {
    if (!user?.id) {
      toast.error('Please Log In')
    }
    const { data, error } = await supabaseClient
      .from('UserInfo')
      .upsert({ ...userProfileData, ...userProfileData, userId: user?.id })
    if (data) {
      toast.success('Profile saved successfully')
    }
    if (error) {
      toast.error(error.message)
    }
  }

  const handleClipoboardCopy = () => {
    const url = `${window.location.origin}/p/${user?.id}`
    clipboard.copy(url)
    toast.success('Copied to clipboard')
  }

  return (
    <form
      className="bg-white divide-y divide-gray-200 lg:col-span-9"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Profile section */}
      <div className="px-4 py-6 sm:p-6 lg:pb-8">
        <div className="flex justify-between ">
          <div>
            <h2 className="text-lg font-medium leading-6 text-gray-900">
              Profile
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your profile information
            </p>
          </div>
          <div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleClipoboardCopy}
            >
              <ShareIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
              Share Link
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-12 sm:col-span-6">
            <label
              htmlFor="last-name"
              className="block text-sm font-medium text-gray-700"
            >
              Business Name
            </label>
            <input
              type="text"
              {...register('businessName')}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
            />
          </div>
          <div className="col-span-12 sm:col-span-6" />

          <div className="col-span-12 sm:col-span-6">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="number"
              {...register('phone')}
              autoComplete="given-name"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
            />
          </div>
          <div className="col-span-12 sm:col-span-6" />
          <div className="col-span-12 sm:col-span-6">
            <label
              htmlFor="about"
              className="block text-sm font-medium text-gray-700"
            >
              Tagline
            </label>
            <div className="mt-1">
              <textarea
                id="about"
                {...register('tagline')}
                rows={3}
                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                defaultValue={''}
              />
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6" />
          <div className="col-span-12 sm:col-span-6">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Website
            </label>
            <div className="flex mt-1 rounded-md shadow-sm">
              <input
                type="text"
                {...register('websiteUrl')}
                autoComplete="username"
                className="flex-grow block w-full min-w-0 border-gray-300 rounded-none rounded-r-md focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Privacy section */}
      <div className="pt-6 divide-y divide-gray-200">
        <div className="flex justify-end px-4 py-4 mt-4 sm:px-6">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 ml-5 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-700 hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  )
}

export default UserProfile

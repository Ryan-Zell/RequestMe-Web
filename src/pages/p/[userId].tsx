import React from 'react'
import { PaperClipIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import Error from 'components/Error'
import useUserProfile from 'hooks/useUserProfile'
import Loader from 'components/Loader'
import useRequests from 'hooks/useRequests'
import { Request } from 'hooks/useRequests'
import RequestComp from 'views/Dashboard/Requests/PublicRequest'

const sortByOrder = (requests: Request[]) => {
  return requests.sort((a, b) => a.order - b.order)
}

const ProfileSlug = () => {
  const router = useRouter()
  const userId = router.query.userId as string

  const { data, isLoading } = useUserProfile(userId)

  const {
    data: requests,
    isLoading: requestsLoading,
  }: {
    data: Request[] | undefined
    isLoading: boolean
  } = useRequests({ userId })

  if (isLoading) {
    return (
      <div className="py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Loader />
      </div>
    )
  }

  if (!data) {
    return <Error />
  }

  if (requests === undefined) {
    return (
      <div className="py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Loader />
      </div>
    )
  }

  const sortedRequest = sortByOrder(requests)

  console.log({ requests })
  return (
    <div className="py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Business Information
          </h3>
          <p className="max-w-2xl mt-1 text-sm text-gray-500">
            Details and requests.
          </p>
        </div>
        <div className="px-4 py-5 border-t border-gray-200 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {data.businessName}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.phone}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Tagline</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.tagline}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Website</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <a href={data.websiteUrl} className="underline ">
                  {data.websiteUrl}
                </a>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Requests</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul
                  role="list"
                  className="border border-gray-200 divide-y divide-gray-200 rounded-md"
                >
                  {sortedRequest.map((request, index) => (
                    <RequestComp request={request} />
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default ProfileSlug

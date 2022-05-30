import React, { useState } from 'react'
import CreateLink from 'views/Links/Forms/CreateLink'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import useRequests from 'hooks/useRequests'
import Loader from 'components/Loader'
import Links from 'views/Links/Links'
import useLinks, { LinkInterface } from 'hooks/useLinks'
import Empty from 'views/Links/Empty'

const DashboardView = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const { user, error } = useUser()

  const { data, isLoading } = useLinks({ userId: user?.id })
  const [selectedLink, setSelectedLink] = useState<
  LinkInterface | null
  >(null)

  const closeModal = () => {
    setCreateModalOpen(false)
    setSelectedLink(null)
  }

  

  if (isLoading || !user) {
    return <Loader />
  }

  console.log({ data })

  return (
    <div>
      {data.length > 0 ? (
        <Links
          links={data}
          setCreateModalOpen={setCreateModalOpen}
          setSelectedLink={setSelectedLink}
        />
      ) : (
        <Empty setCreateModalOpen={setCreateModalOpen} />
      )}
      <CreateLink
        open={createModalOpen}
        setOpen={closeModal}
        selectedLink={selectedLink}
      />
    </div>
  )
}

export default DashboardView

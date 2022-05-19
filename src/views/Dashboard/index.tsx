import React, { useState } from 'react'
import CreateRequest from 'views/Dashboard/Forms/CreateRequest'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import useRequests from 'hooks/useRequests'
import Loader from 'components/Loader'
import Requests from 'views/Dashboard/Requests'
import { Request } from 'hooks/useRequests'
import Empty from 'views/Dashboard/Empty'
import { RequestItem } from './Requests/Request'

const DashboardView = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const { user, error } = useUser()

  const { data, isLoading } = useRequests({ userId: user?.id })
  const [selectedRequestItems, setSelectedRequestItems] = useState<RequestItem[] | null>(null)

  const closeModal = () => {
    setCreateModalOpen(false)
    setSelectedRequestItems(null)
  }


  if (isLoading || !user) {
    return <Loader />
  }


  return (
    <div>
      {data.length > 0 ? (
        <Requests
          requests={data}
          setCreateModalOpen={setCreateModalOpen}
          setSelectedRequestItems={setSelectedRequestItems}
        />
      ) : (
        <Empty setCreateModalOpen={setCreateModalOpen} />
      )}
      <CreateRequest open={createModalOpen} setOpen={closeModal}  selectedRequestItems={selectedRequestItems}/>
    </div>
  )
}

export default DashboardView

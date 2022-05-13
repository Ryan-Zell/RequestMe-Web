import React, { useState } from 'react'
import CreateRequest from 'views/Dashboard/Forms/CreateRequest'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import useRequests from 'hooks/useRequests'
import Loader from 'components/Loader'
import Requests from 'views/Dashboard/Requests'
import Empty from 'views/Dashboard/Empty'

const DashboardView = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const { user, error } = useUser()

  const { data, isLoading } = useRequests({ userId: user?.id })

  if (isLoading || !user) {
    return <Loader />
  }

  return (
    <div>
      {data.length > 0 ? (
        <Requests requests={data} setCreateModalOpen={setCreateModalOpen} />
      ) : (
        <Empty setCreateModalOpen={setCreateModalOpen} />
      )}
      <CreateRequest open={createModalOpen} setOpen={setCreateModalOpen} />
    </div>
  )
}

export default DashboardView

import React from 'react'
import { Request } from 'hooks/useRequests'
import useRequest from 'hooks/useRequest'
import Loader from 'components/Loader'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import { toast } from 'react-hot-toast'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useQueryClient } from 'react-query'

export interface RequestItem {
  id: string
  category: string
  items: {
    name: string
  }[]
  requestId: string
}

const Request = ({ request }: { request: Request }) => {
  const {
    data,
    isLoading,
  }: { data: RequestItem[] | undefined; isLoading: boolean } = useRequest({
    requestId: request.id,
  })

  const queryClient = useQueryClient()

  if (isLoading) {
    return (
      <li className="px-4 py-4 overflow-hidden bg-white shadow sm:rounded-md sm:px-6">
        <Loader />
      </li>
    )
  }

  const handleDelete = async () => {
    toast('Deleting Request')

    const { data, error } = await supabaseClient
      .from('RequestItem')
      .delete()
      .match({ requestId: request.id })

    if (data) {
      const { data: requestDeleteData, error: requestDeleteError } =
        await supabaseClient.from('Request').delete().match({ id: request.id })
      queryClient.invalidateQueries('requests')

      if (requestDeleteData) {
        toast.success('Request Deleted')
      }

      if (requestDeleteError) {
        toast.error('Error Deleting Request')
      }
    }

    if (error) {
      toast.error('Error Deleting Request')
    }
  }

  return (
    <li className="px-4 py-4 overflow-hidden bg-white shadow sm:rounded-md sm:px-6">
      <div>
        {data &&
          data.map((item) => (
            <div className="flex flex-col ">
              <span className={item.id}>
                {' '}
                <strong>Category</strong> : {item.category}
              </span>
              <span>
                <strong>Items</strong>
              </span>
              <ul>
                {item.items.map((item) => (
                  <li>{item.name}</li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </li>
  )
}

export default Request

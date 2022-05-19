import React from 'react'
import { Request } from 'hooks/useRequests'
import useRequest from 'hooks/useRequest'
import Loader from 'components/Loader'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { PencilAltIcon,TrashIcon } from '@heroicons/react/solid'
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

const Request = ({
  request,
  index,
  handleSetSelectedRequestItems,
}: {
  request: Request
  index: number
  handleSetSelectedRequestItems: (items: RequestItem[]) => void
}) => {
  const {
    data,
    isLoading,
  }: { data: RequestItem[] | undefined; isLoading: boolean } = useRequest({
    requestId: request.id,
  })

  const queryClient = useQueryClient()

  if (isLoading) {
    return <Loader />
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
    <Draggable draggableId={`${request.id}`} index={index} key={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="px-4 py-4 overflow-hidden bg-white shadow sm:rounded-md sm:px-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between ">
              <div>
                <strong>RequestId</strong> : {request.id}
              </div>
              <div className="flex gap-2 ">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => {
                    if (data) {
                      handleSetSelectedRequestItems(data)
                    }
                  }}
                >
                  <PencilAltIcon
                    className="w-5 h-5 mr-2 -ml-1"
                    aria-hidden="true"
                  />
                  Edit
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={handleDelete}
                >
                  <TrashIcon
                    className="w-5 h-5 mr-2 -ml-1"
                    aria-hidden="true"
                  />
                  Delete
                </button>
              </div>
            </div>
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
      )}
    </Draggable>
  )
}

export default Request

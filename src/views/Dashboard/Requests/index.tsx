import React, { useEffect, Fragment, useState } from 'react'
import { Request } from 'hooks/useRequests'
import RequestComp from './Request'
import { PlusIcon } from '@heroicons/react/solid'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { RequestItem } from './Request'

const reorder = (list: Request[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const sortByOrder = (requests: Request[]) => {
  return requests.sort((a, b) => a.order - b.order)
}

const Requests = ({
  requests,
  setCreateModalOpen,
  setSelectedRequestItems
}: {
  requests: Request[]
  setCreateModalOpen: (open: boolean) => void,
  setSelectedRequestItems: (request: RequestItem[] | null) => void,
}) => {
  const [requestsState, setRequestsState] = useState(sortByOrder(requests))


  const handleSetSelectedRequestItems = (items: RequestItem[]) => {
    setCreateModalOpen(true)
    setSelectedRequestItems(items)
  }

  useEffect(() => {
    setRequestsState(sortByOrder(requests))
  }, [requests])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const reorderedRequets = reorder(
      requestsState,
      result.source.index,
      result.destination.index
    )

    supabaseClient
      .from('Request')
      .upsert(
        reorderedRequets.map((request, index) => ({
          ...request,
          order: index,
        }))
      )
      .then((data) => {
        console.log({ upsertResponse: data })
      })

    setRequestsState(reorderedRequets)
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">Requests</span>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => setCreateModalOpen(true)}
        >
          <PlusIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
          New Request
        </button>
      </div>
      <div>
        <p className="text-sm text-gray-500">Drag request to reorder them</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <ul
              role="list"
              className="space-y-3"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {requestsState.map((request, index) => (
                <Fragment key={request.id}>
                  <RequestComp
                    request={request}
                    index={index}
                    handleSetSelectedRequestItems={handleSetSelectedRequestItems}
                  />
                  {provided.placeholder}
                </Fragment>
              ))}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default Requests

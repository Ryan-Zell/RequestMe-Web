import React from 'react'
import { Request } from 'hooks/useRequests'
import useRequest from 'hooks/useRequest'
import Loader from 'components/Loader'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export interface RequestItem {
  id: string
  category: string
  items: {
    name: string
  }[]
  requestId: string
}

const Request = ({ request, index }: { request: Request; index: number }) => {
  const {
    data,
    isLoading,
  }: { data: RequestItem[] | undefined; isLoading: boolean } = useRequest({
    requestId: request.id,
  })

  if (isLoading) {
    return <Loader />
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
            <div>
              <strong>RequestId</strong> : {request.id}
            </div>
            {data &&
              data.map((item) => (
                <div className="flex flex-col ">
                  <span className={item.id}>
                    {' '}
                    <strong>Category</strong> : {item.category}
                  </span>
                  <span><strong>Items</strong></span>
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

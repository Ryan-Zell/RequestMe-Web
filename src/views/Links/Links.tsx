import React from 'react'
import { LinkInterface } from 'hooks/useLinks'
import { PlusIcon, PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import { toast } from 'react-hot-toast'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useQueryClient } from 'react-query'

const Links = ({
  links,
  setCreateModalOpen,
  setSelectedLink,
}: {
  links: LinkInterface[]
  setCreateModalOpen: (open: boolean) => void
  setSelectedLink: (link: LinkInterface | null) => void
}) => {
  const handleSetSelectedRequestItems = (data: LinkInterface) => {
    setCreateModalOpen(true)
    setSelectedLink(data)
  }

  const queryClient = useQueryClient()

  const handleDelete = async (id: string) => {
    toast('Deleting Link')

    const { data: requestDeleteData, error: requestDeleteError } =
      await supabaseClient.from('Link').delete().match({ id })

    queryClient.invalidateQueries('links')

    if (requestDeleteData) {
      toast.success('Link Deleted')
    }

    if (requestDeleteError) {
      toast.error('Error Deleting Link')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">Links</span>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => setCreateModalOpen(true)}
        >
          <PlusIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
          New Link
        </button>
      </div>
      <ul role="list" className="space-y-3">
        {links.map((link) => (
          <li
            key={link.id}
            className="px-4 py-4 overflow-hidden bg-white shadow sm:rounded-md sm:px-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="uppercase">{link.type}</strong>
                </div>
                <div className="flex gap-2 ">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => {
                      if (link) {
                        handleSetSelectedRequestItems(link)
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
                    onClick={() => handleDelete(link.id)}
                  >
                    <TrashIcon
                      className="w-5 h-5 mr-2 -ml-1"
                      aria-hidden="true"
                    />
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex flex-col ">
                <span>
                  <strong>URL</strong> : {link.url}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Links

import { Fragment, FC } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'
import CategoryArray from 'views/Dashboard/Forms/CategoryArray'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { toast } from 'react-hot-toast'
import { useQueryClient } from 'react-query'

interface CreateRequestProps {
  open: boolean
  setOpen: (open: boolean) => void
}

interface RequestForm {
  request: {
    category: string
    items: { name: string }[]
  }[]
}

const defaultValues = {
  request: [
    {
      category: 'category name',
      items: [{ name: 'item name' }],
    },
  ],
}

const CreateRequestform: FC<CreateRequestProps> = ({ open, setOpen }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
  } = useForm<RequestForm>({
    defaultValues,
  })

  const { user, error } = useUser()
  const queryClient = useQueryClient()

  const onSubmit = async (requestData) => {
    if (!user?.id) {
      toast.error('Please Log In')
    }
    const { data, error } = await supabaseClient
      .from('Request')
      .insert({ userId: user?.id })
      .single()
    if (data) {
      toast.success('Request saved successfully')
      const requestRequestNormalized = requestData.request.map((item) => ({
        ...item,
        requestId: data.id,
      }))

      const { data: requestItemData, error: requestItemError } =
        await supabaseClient
          .from('RequestItem')
          .insert(requestRequestNormalized)
      if (requestItemData) {
        toast.success('Requst items saved successfully')
        reset()
        queryClient.invalidateQueries('requests')
        setOpen(false)
      }
      if (requestItemError) {
        toast.error(requestItemError.message)
      }
    }
    if (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="w-screen max-w-3xl pointer-events-auto">
                  <form className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl">
                    <div className="flex-1 h-0 overflow-y-auto">
                      <div className="px-4 py-6 bg-indigo-700 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-medium text-white">
                            New Request
                          </Dialog.Title>
                          <div className="flex items-center ml-3 h-7">
                            <button
                              type="button"
                              className="text-indigo-200 bg-indigo-700 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XIcon className="w-6 h-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-indigo-300">
                            Get started by filling in the information below to
                            create your new Request.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div className="px-4 divide-y divide-gray-200 sm:px-6">
                          <div className="pt-6 pb-5 space-y-6">
                            <CategoryArray
                              {...{
                                control,
                                register,
                                defaultValues,
                                getValues,
                                setValue,
                                errors,
                              }}
                            />
                            {/* <div>
                              <label
                                htmlFor="project-name"
                                className="block text-sm font-medium text-gray-900"
                              >
                                Category
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  {...register('category')}
                                  className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div> */}
                            {/* <div>
                              <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-900"
                              >
                                Description{' '}
                              </label>
                              <div className="mt-1">
                                <textarea
                                  id="description"
                                  name="description"
                                  rows={4}
                                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  defaultValue={''}
                                />
                              </div>
                            </div> */}
                            <div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end flex-shrink-0 px-4 py-4">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        className="inline-flex justify-center px-4 py-2 ml-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default CreateRequestform

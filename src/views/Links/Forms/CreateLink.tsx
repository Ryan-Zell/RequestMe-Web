import { Fragment, FC, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { useForm, SubmitHandler } from 'react-hook-form'
import CategoryArray from 'views/Dashboard/Forms/CategoryArray'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { toast } from 'react-hot-toast'
import { useQueryClient } from 'react-query'
import { LinkInterface } from 'hooks/useLinks'

interface CreateRequestProps {
  open: boolean
  setOpen: (open: boolean) => void
  selectedLink: LinkInterface | null
}

export interface LinkForm {
  url: string
  type: 'payment' | 'outside' | 'footer'
}

const CreateRequestform: FC<CreateRequestProps> = ({
  open,
  setOpen,
  selectedLink,
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
  } = useForm<LinkForm>({
    defaultValues: selectedLink
      ? {}
      : {
          type: 'payment',
        },
  })

  const { user, error } = useUser()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (selectedLink) {
      reset(selectedLink)
    }
  }, [selectedLink])

  const onSubmit: SubmitHandler<LinkForm> = async (linkData) => {
    console.log({ linkData })
    if (!user?.id) {
      toast.error('Please Log In')
    }

    let normalizedLinkData = {
      ...linkData,
      userId: user?.id,
    }

    if (selectedLink) {
      normalizedLinkData = {
        ...selectedLink,
        ...linkData,
        userId: user?.id,
      }
    }

    const { data, error } = await supabaseClient
      .from('Link')
      .upsert(normalizedLinkData)

    if (data) {
      if (selectedLink) {
        toast.success('Link updated successfully')
      } else {
        toast.success('Link saved successfully')
      }
      reset()
      queryClient.invalidateQueries('links')
      setOpen(false)
    }
    if (error) {
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
                            {selectedLink ? 'Edit Link' : ' New Link'}
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
                            create your new Link.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div className="px-4 divide-y divide-gray-200 sm:px-6">
                          <div className="pt-6 pb-5 space-y-6">
                            <div>
                              <label
                                htmlFor="location"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Link Type
                              </label>
                              <select
                                className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                defaultValue="Canada"
                                {...register('type', {
                                  required: 'Type is required',
                                })}
                              >
                                <option value="payment">Payment</option>
                                <option value="outside">Outside Link</option>
                                <option value="footer">Footer Link</option>
                              </select>
                            </div>
                            <div>
                              <label
                                htmlFor="street-address"
                                className="block text-sm font-medium text-gray-700"
                              >
                                URL
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  {...register('url', {
                                    required: 'Type is required',
                                    pattern: {
                                      value:
                                        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                                      message: 'Enter a valid url',
                                    },
                                  })}
                                  className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                              {errors.url && (
                                <div className="mt-1 ml-2 text-sm text-red-600">
                                  {errors.url.message}
                                </div>
                              )}
                            </div>
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
                        {selectedLink ? 'Update' : 'Save'}
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

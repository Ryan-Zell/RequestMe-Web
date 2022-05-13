import React from 'react'
import { useFieldArray, Control, UseFormRegister } from 'react-hook-form'
import { RequestForm } from 'views/Dashboard/Forms/CreateRequest'
export default ({
  nestIndex,
  control,
  register,
}: {
  nestIndex: number
  control: Control<RequestForm>
  register: UseFormRegister<RequestForm>
}) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `request.${nestIndex}.items`,
  })

  return (
    <div className="flex flex-col ">
      <label
        htmlFor="project-name"
        className="block mt-2 ml-2 text-sm font-medium text-gray-900"
      >
        Items
      </label>
      {fields.map((item, index) => {
        return (
          <div key={item.id}>
            <div className="flex mt-1 ">
              <input
                type="text"
                {...register(`request.${nestIndex}.items.${index}.name`)}
                defaultValue={item.name}
                placeholder="Name"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="inline-flex justify-center px-4 py-2 ml-4 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        )
      })}

      <div>
        <button
          type="button"
          className="justify-center px-4 py-2 mt-4 ml-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm ml-4inline-flex hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() =>
            append({
              name: '',
            })
          }
        >
          Add Item
        </button>
      </div>
      <hr className="mt-4" />
    </div>
  )
}

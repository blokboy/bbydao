import React from "react"

const DaoForm = () => {
  return (
    <div className="w-full flex justify-center">
      <form className="shadow-md w-full md:w-10/12 rounded-xl px-8 pt-6 pb-8 mb-4 bg-gray-100 dark:bg-gray-800">
        <div className="w-full text-xl text-center font-bold mb-8">
          create your dao
        </div>
        <div className="mb-8">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 dark:bg-gray-900"
            id="username"
            type="text"
            placeholder="name"
          />
        </div>
        <div className="mb-8">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            about
          </label>
          <div className="h-56">
            <textarea
              className="shadow appearance-none border rounded w-full h-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 dark:bg-gray-900"
              type="textarea"
              placeholder="enter a short description"
            />
          </div>
        </div>
        <div className="mb-8">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            invite friends
          </label>
          <p className="text-xs mb-2">separate usernames with comma</p>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 dark:bg-gray-900"
            id="username"
            type="text"
            placeholder="@username"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="w-full font-bold py-3 px-4 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:shadow-outline bg-gray-200 dark:bg-gray-900"
            type="button"
          >
            save
          </button>
        </div>
      </form>
    </div>
  )
}

export default DaoForm

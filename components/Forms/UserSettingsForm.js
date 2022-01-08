import React from "react"
import useForm from "hooks/useForm"
import { useRouter } from "next/router"
import { useAccountStore } from "stores/useAccountStore"
import { useMutation } from "react-query"
import * as api from "query"

const UserSettingsForm = () => {
  const router = useRouter()

  const { state, handleChange } = useForm()

  const userData = useAccountStore(state => state.userData)
  const setUpdateUserData = useAccountStore(state => state.setUpdateUserData)

  const { status, mutateAsync } = useMutation(api.updateUser)

  const handleUpdateRequest = event => {
    event.preventDefault()

    const req = {
      id: userData.id,
      ...state,
    }

    // review
    mutateAsync(req, {
      onSuccess: () => {
        if (status === "success") {
          setUpdateUserData(req)
          router.push(`/user/${userData.username}`)
        }
        if (status === "error") {
          console.log(error)
        }
      },
    })
  }

  // route to 404 with suggestions
  if (!userData) {
    return <h1>no user</h1>
  }

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleUpdateRequest}
        className="shadow-xl w-full md:w-3/6 rounded-xl px-8 pt-6 pb-8 mb-4 bg-gray-100 dark:bg-gray-900"
      >
        <div className="w-full text-xl text-center font-bold mb-8">
          user settings
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            username
          </label>
          <input
            value={state.username || ""}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 dark:bg-gray-800"
            id="username"
            name="username"
            type="text"
            placeholder="username"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold mb-2" htmlFor="email">
            email
          </label>
          <input
            value={state.email || ""}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 dark:bg-gray-800"
            id="email"
            name="email"
            type="email"
            placeholder="email"
          />
        </div>

        {/* <div className="mb-8">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            about
          </label>
          <div className="h-56">
            <textarea
              className="shadow appearance-none border rounded w-full h-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 dark:bg-gray-800"
              type="textarea"
              placeholder="enter a short description"
            />
          </div>
        </div> */}

        <div className="flex items-center justify-between">
          <button
            className="w-full font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline shadow-xl bg-gray-200 dark:bg-gray-800"
            type="submit"
          >
            save
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserSettingsForm

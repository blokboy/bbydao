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
      onSettled: data => {
        console.log("settings form", data)
        setUpdateUserData(data)
        router.push(`/user/${userData.address}`)
      },
    })
  }

  // route to 404 with suggestions
  if (!userData) {
    return <h1>no user</h1>
  }

  return (
    <div className="flex h-screen w-full justify-center">
      <form
        onSubmit={handleUpdateRequest}
        className="mb-4 h-1/2 w-full rounded-xl bg-slate-100 px-8 pt-6 pb-8 shadow-xl dark:bg-slate-900 md:w-3/6"
      >
        <div className="mb-8 w-full text-center text-xl font-bold">
          user settings
        </div>

        {/* <div className="mb-8">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            username
          </label>
          <input
            value={state.username || ""}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-slate-200 dark:bg-slate-800"
            id="username"
            name="username"
            type="text"
            placeholder="username"
          />
        </div> */}

        <div className="mb-8">
          <label className="mb-2 block text-sm font-bold" htmlFor="email">
            email
          </label>
          <input
            value={state.email || ""}
            onChange={handleChange}
            className="focus:shadow-outline w-full appearance-none rounded border bg-slate-200 py-2 px-3 leading-tight shadow focus:outline-none dark:bg-slate-800"
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
              className="shadow appearance-none border rounded w-full h-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-slate-200 dark:bg-slate-800"
              type="textarea"
              placeholder="enter a short description"
            />
          </div>
        </div> */}

        <div className="flex items-center justify-between">
          <button
            className="focus:shadow-outline w-full rounded-xl bg-slate-200 py-3 px-4 font-bold shadow-xl focus:outline-none dark:bg-slate-800"
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

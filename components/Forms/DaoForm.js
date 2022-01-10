import React from "react"
import useForm from "hooks/useForm"
import { useUiStore } from "stores/useUiStore"
import { useConnect } from "wagmi"

const DaoForm = () => {
  const { state, handleChange } = useForm()
  const [{ data, error }, connect] = useConnect()

  const createDaoModalOpen = useUiStore(state => state.createDaoModalOpen)
  const setCreateDaoModalOpen = useUiStore(state => state.setCreateDaoModalOpen)

  const closeModal = e => {
    if (!createDaoModalOpen && e.target) {
      return
    }
    setCreateDaoModalOpen()
  }

  if (!createDaoModalOpen) return <></>

  return (
    <div
      className="fixed z-40 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      onClick={e => closeModal(e)}
    >
      {/* <div className="w-full flex justify-center"> */}
      {data.connected ? (
        <form className="flex flex-col mt-24 mx-auto z-50 rounded shadow-xl w-full md:w-3/6 md:rounded-xl px-8 pt-6 pb-8 mb-4 bg-gray-100 dark:bg-gray-900">
          <div className="w-full text-xl text-center font-bold mb-8">
            create your dao
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              name
            </label>
            <input
              value={state.name || ""}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 dark:bg-gray-800"
              id="name"
              name="name"
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
                value={state.about || ""}
                onChange={handleChange}
                id="about"
                name="about"
                className="shadow appearance-none border rounded w-full h-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 dark:bg-gray-800"
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
              value={state.invite || ""}
              onChange={handleChange}
              id="invite"
              name="invite"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 dark:bg-gray-800"
              type="text"
              placeholder="@username"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="w-full font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline shadow-xl bg-gray-200 dark:bg-gray-800"
              type="button"
            >
              save
            </button>
          </div>
        </form>
      ) : (
        <></>
      )}
      {/* </div> */}
    </div>
  )
}

export default DaoForm

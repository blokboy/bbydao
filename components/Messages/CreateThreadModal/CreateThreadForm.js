import React from "react"
import useForm from "hooks/useForm"

const CreateThreadForm = ({ closeModal }) => {
  const { state, setState, handleChange } = useForm()

  const handleSubmit = async e => {
    e.preventDefault()
    console.log(state)
    setState({})
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <div className="mb-8 w-full text-center text-xl font-bold">
        start message thread
      </div>

      <div className="mb-8">
        <label className="mb-2 block text-sm font-bold" htmlFor="name">
          invites
        </label>
        <input
          value={state.invites || ""}
          onChange={handleChange}
          className="focus:shadow-outline w-full appearance-none rounded border bg-slate-200 py-2 px-3 leading-tight shadow focus:outline-none dark:bg-slate-800"
          id="invites"
          name="invites"
          type="text"
          placeholder="invites"
        />
      </div>

      <div className="mb-8">
        <label className="mb-2 block text-sm font-bold" htmlFor="name">
          body
        </label>
        <div className="h-56">
          <textarea
            value={state.body || ""}
            onChange={handleChange}
            id="body"
            name="body"
            className="focus:shadow-outline h-full w-full appearance-none rounded border bg-slate-200 py-2 px-3 leading-tight shadow focus:outline-none dark:bg-slate-800"
            type="textarea"
            placeholder="message body"
          />
        </div>
      </div>

      <div className="mb-8">
        <label className="mb-2 block text-sm font-bold" htmlFor="name">
          name
        </label>
        <input
          value={state.name || ""}
          onChange={handleChange}
          className="focus:shadow-outline w-full appearance-none rounded border bg-slate-200 py-2 px-3 leading-tight shadow focus:outline-none dark:bg-slate-800"
          id="name"
          name="name"
          type="text"
          placeholder="name"
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          className="focus:shadow-outline w-full rounded-xl bg-slate-200 py-3 px-4 font-bold shadow-xl focus:outline-none dark:bg-slate-800"
          type="submit"
        >
          save
        </button>
      </div>
    </form>
  )
}

export default CreateThreadForm

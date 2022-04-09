import React from "react"
import * as api from "query"
import { useQueryClient, useMutation } from "react-query"
import { useMessageStore } from "stores/useMessageStore"
import { useAccount } from "wagmi"
import useForm from "hooks/useForm"

const MobileMessageInput = () => {
  const { state, setState, handleChange } = useForm()
  const queryClient = useQueryClient()
  const { threadChannel } = useMessageStore()

  const {
    data,
    error,
    mutateAsync: createMessage,
  } = useMutation(api.createMessage, {
    onSettled: async () => {
      await queryClient.invalidateQueries(["thread messages", threadChannel], {
        refetchActive: true,
      })
    },
  })

  const [{ data: accountData, error: accountError, loading: accountLoading }] =
    useAccount()

  const handleSubmit = e => {
    e.preventDefault()
    if (!accountData) {
      console.log("MessageForm.js no account data")
      return
    }
    const req = {
      sender: accountData.address,
      channel: threadChannel,
      body: state.message,
    }
      createMessage(req)
    setState({})
  }

  return (
    <form
      className="fixed inset-x-0 bottom-0 flex h-20 flex-row p-3 bg-slate-100 dark:bg-slate-800"
      onSubmit={handleSubmit}
    >
      <textarea
        autoFocus
        className="h-full w-[90%] resize-none rounded-xl bg-slate-100 p-3 text-white focus:text-slate-900 focus:outline-none dark:bg-slate-700 dark:focus:text-slate-100"
        type="textarea"
        name="message"
        placeholder="Message..."
        autoComplete="off"
        value={state.message || ""}
        onChange={handleChange}
        required
      />
      <button
        className="mx-3 flex items-center rounded-xl border bg-slate-200 p-3 font-bold shadow-xl focus:outline-none dark:bg-slate-700"
        type="submit"
      >
        send
      </button>
    </form>
  )
}

export default MobileMessageInput

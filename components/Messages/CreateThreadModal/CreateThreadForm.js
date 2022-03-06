import React from "react"
import { useRouter } from "next/router"
import Select from "react-select"
import { customStyles } from "./customStyles"
import useForm from "hooks/useForm"
import * as api from "query"
import { useQuery, useMutation } from "react-query"
import { useAccount } from "wagmi"
import { useMessageStore } from "../../../stores/useMessageStore"

const CreateThreadForm = ({ closeModal }) => {
  const router = useRouter()
  const { state, setState, handleChange } = useForm()
  const [selectedOptions, setSelectedOptions] = React.useState([])
  const [{ data: accountData }] = useAccount()
  const setThreadChannel = useMessageStore(state => state.setThreadChannel)

  const { data: friendData } = useQuery(
    ["friends", accountData?.address],
    () => api.getFriends({ initiator: accountData?.address }),
    {
      refetchOnWindowFocus: false,
      staleTime: 180000,
    }
  )

  const { status, mutateAsync } = useMutation(api.createMessage, {
    onSettled: async data => {
      const result = await data
      setThreadChannel(result?.channel)
    },
  })

  const friends = friendData?.map(friend => {
    return {
      value:
        friend.initiator === accountData?.address
          ? friend.target
          : friend.initiator,
      label:
        friend.initiator === accountData?.address
          ? friend.targetEns || friend.target
          : friend.initiatorEns,
    }
  })

  const handleSelectedOptions = options => {
    const selectedAddresses = options.map(option => option.value)
    setSelectedOptions(selectedAddresses)
  }

  const handleSubmit = async e => {
    if (!accountData?.address) {
      console.log("CreateThreadForm: No account data")
      return
    }
    e.preventDefault()
    let arr = [accountData?.address, ...selectedOptions]
    const req = {
      sender: accountData?.address,
      body: state.body,
      addresses: arr,
    }
    mutateAsync(req)
    setState({})
    closeModal()
    router.push("/messages")
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <div className="mb-8 w-full text-center text-xl font-bold">
        start message thread
      </div>

      <label className="mb-2 block text-sm font-bold" htmlFor="name">
        invites
      </label>
      <Select
        styles={customStyles}
        isMulti
        name="invites"
        options={friends}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleSelectedOptions}
      />

      <div className="mb-3 mt-3">
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
          channel name
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
          className="focus:shadow-outline mb-3 w-full rounded-xl bg-slate-200 py-3 px-4 font-bold shadow-xl focus:outline-none dark:bg-slate-800"
          type="submit"
        >
          save
        </button>
      </div>
    </form>
  )
}

export default CreateThreadForm

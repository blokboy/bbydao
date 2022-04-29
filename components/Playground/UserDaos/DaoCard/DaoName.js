import useForm from "hooks/useForm"
import * as api from "query"
import React, { useEffect, useState } from "react"
import { HiCheckCircle, HiPencilAlt } from "react-icons/hi"
import { useMutation, useQueryClient } from "react-query"
import { walletSnippet } from "utils/helpers"

const DaoName = ({ safe, isMember, loading }) => {
  const [isEditable, setIsEditable] = useState(false)
  const { state, setState, handleChange } = useForm()

  // useQueryClient to query for the dao data (fetched in DaoCard/index.js)
  // also used to invalidate and refetch the dao data when the dao name is changed
  const queryClient = useQueryClient()
  const daoData = queryClient.getQueryData(["dao", safe])

  React.useEffect(() => {
    if (!!daoData?.name) setState({ name: daoData.name })
  }, [daoData])

  const { mutateAsync: editDaoName } = useMutation(api.updateDao, {
    onSuccess: () => {
      queryClient.invalidateQueries(["dao", safe], {
        refetchActive: true,
      })
    }
  })

  const handleFocus = e => {
    e.target.select()
  }

  const handleSave = () => {
    setIsEditable(flag => !flag)
    const shouldSave = !!state.name && daoData.name !== state.name
    if (isEditable && shouldSave) {
      editDaoName({ id: daoData.id, name: state.name })
    }
  }

  return (
    <div className="flex flex-row items-center space-x-1 py-2">
      {isMember ? (
        <button
          onClick={e => handleSave(e)}
          className="flex flex-col items-center justify-center rounded-lg border border-slate-100 bg-slate-100 p-1 text-center text-sm hover:border-white hover:bg-slate-200 hover:text-teal-300 dark:border-slate-600 dark:bg-slate-600 dark:hover:border-white dark:hover:bg-slate-500"
        >
          {isEditable ? <HiCheckCircle size={22} /> : <HiPencilAlt size={22} />}
        </button>
      ) : null}
      <div className="text-2xl">
        <form className="flex flex-col">
          <input
            value={loading ? " " : daoData?.name === undefined ? walletSnippet(safe) : state.name}
            onChange={handleChange}
            onFocus={handleFocus}
            name={"name"}
            className={`focus:outline-0 w-full bg-slate-${isEditable ? "300" : "200"} dark:bg-slate-${
              isEditable ? "900" : "800"
            } rounded-xl p-2 font-bold ${isEditable ? "shadow-inner" : ""}`}
            disabled={!isEditable}
            type="text"
           // autoFocus
          />
        </form>
      </div>
    </div>
  )
}

export default DaoName

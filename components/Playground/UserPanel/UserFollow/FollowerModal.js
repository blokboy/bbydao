import React, { useCallback, useMemo } from "react"
import Link from "next/link"
import { walletSnippet } from "utils/helpers"
import useForm from "hooks/useForm"

const FollowerModal = ({ followers }) => {
  const { state,  handleChange } = useForm()
  const filter = useMemo(() => {
    return followers.reduce((acc = [], cv) => {
      if (cv.initiatorEns.includes(state.name) || cv.initiator.includes?.(state.name)) {
        acc.push(cv)
      }

      return acc
    }, [])
  }, [state.name])

  return (
    <div>
      <form>
        <input id="name" name="name" onChange={handleChange} value={state?.name || ""} />
      </form>

      <div className="flex flex-col py-4">
        {(filter.length === 0 && state.name.length === 0 && !!followers ? followers : filter)?.map(f => (
          <Link href={`/playground/${f.initiator}`} key={f.id}>
            <div className="mb-2 rounded-lg bg-slate-300 p-4 hover:cursor-pointer hover:bg-slate-400 hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700">
              {f.initiatorEns || walletSnippet(f.initiator)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default FollowerModal

import React from "react"
import { useDaoStore } from "../../../stores/useDaoStore"
import { GoSearch } from "react-icons/go"
import OsResultsLoading from "./OsResultsLoading"
import OsResultsSuccess from "./OsResultsSuccess"
import axios from "axios"

const reducer = (state, action) => {
  switch (action.type) {
    case "fetch_start":
      return {
        ...state,
        isLoading: true,
        hasError: false,
      }
    case "fetch_success":
      return {
        ...state,
        isLoading: false,
        hasError: false,
        hits: action.payload,
      }
    case "fetch_failure":
      return {
        ...state,
        isLoading: false,
        hasError: true,
      }
    default:
      throw new Error()
  }
}

const fetchHits = async (query, dispatch) => {
  dispatch({ type: "fetch_start" })
  try {
    const result = await axios.post(
      `https://minidao.herokuapp.com/collection/search`,
      { name: query }
    )
    dispatch({ type: "fetch_success", payload: result.data })
  } catch (err) {
    dispatch({ type: "fetch_failure" })
    axios.isCancel(err) || dispatch({ type: "fetch_failure" })
  }
}

const OsSearchBar = () => {
  const [{ hits, hasError, isLoading }, dispatch] = React.useReducer(reducer, {
    hits: [],
    isLoading: true,
    hasError: false,
  })
  const [query, setQuery] = React.useState("")

  React.useEffect(() => {
    const { cancel, token } = axios.CancelToken.source()
    const timeOutId = setTimeout(() => fetchHits(query, dispatch, token), 500)
    return () => cancel("No longer latest query") || clearTimeout(timeOutId)
  }, [query])

  const openSeaModalOpen = useDaoStore(state => state.openSeaModalOpen)
  const setOpenSeaModalOpen = useDaoStore(state => state.setOpenSeaModalOpen)

  const handleKeyDown = event => {
    if (event.keyCode === 27) {
      if (openSeaModalOpen) {
        setQuery("")
        setOpenSeaModalOpen()
      }
      return
    }
  }

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

  const closeModal = e => {
    if (!openSeaModalOpen && e.target) {
      return
    }
    setQuery("")
    setOpenSeaModalOpen()
  }

  if (!openSeaModalOpen) return <></>

  return (
    <div
      className="z-50 mx-auto mt-24 flex w-11/12 flex-col rounded-xl bg-slate-200 px-4 py-2 shadow dark:bg-slate-900 md:w-6/12"
      onClick={e => closeModal(e)}
    >
      <div className="relative w-full border-b-2 border-slate-300 py-3 text-slate-600 focus-within:text-slate-400 dark:focus-within:text-slate-100">
        <span className="absolute left-0 top-4 flex items-center pl-2">
          <GoSearch size={24} />
        </span>
        <input
          autoFocus
          className="w-full bg-slate-200 py-2 pl-12 text-sm text-white focus:text-slate-900 focus:outline-none dark:bg-slate-900 dark:focus:text-slate-100"
          placeholder="Search OpenSea..."
          autoComplete="off"
          onChange={event => setQuery(event.target.value)}
          value={query}
          name="OpenSeaSearch"
        />
        <button
          className="absolute right-2 top-3 rounded-lg border px-2 py-1 dark:text-white"
          onClick={setOpenSeaModalOpen}
        >
          esc
        </button>
      </div>

      {/* if there are hits in the search, pass them to OsResults */}
      {isLoading && query.length ? (
        <OsResultsLoading />
      ) : hits.length && query.length ? (
        <OsResultsSuccess hits={hits} closeModal={closeModal} />
      ) : !query.length ? (
        <>
          <div className="flex h-24 w-full items-center justify-center">
            <h1 className="font-semibold">start typing...</h1>
          </div>
        </>
      ) : hasError ? (
        <>
          <div className="flex h-24 w-full items-center justify-center">
            <h1 className="font-semibold text-red-500">something went wrong</h1>
          </div>
        </>
      ) : (
        <OsResultsLoading />
      )}
    </div>
  )
}

export default OsSearchBar

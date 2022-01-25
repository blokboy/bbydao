import React from "react"
import useForm from "hooks/useForm"
import { useDaoStore } from "../../../stores/useDaoStore"
import { GoSearch } from "react-icons/go"
import OsResults from "./OsResults"
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

const OsSearchBar = () => {
  // reducer to manage state between keydown events / queries

  const { state, setState, handleChange } = useForm()
  const [hits, setHits] = React.useState()

  const openSeaModalOpen = useDaoStore(state => state.openSeaModalOpen)
  const setOpenSeaModalOpen = useDaoStore(state => state.setOpenSeaModalOpen)

  const handleKeyDown = event => {
    if (event.keyCode === 27) {
      if (openSeaModalOpen) {
        setState({})
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
    setState({})
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
          onChange={handleChange}
          value={state.OpenSeaSearch || ""}
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
      {state.OpenSeaSearch?.length ? (
        <OsResults />
      ) : (
        <>
          <div className="flex h-24 w-full items-center justify-center">
            <h1 className="font-semibold">start typing...</h1>
          </div>
        </>
      )}
    </div>
  )
}

export default OsSearchBar

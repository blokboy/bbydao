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
      className="flex flex-col z-50 mt-24 mx-auto rounded-xl shadow bg-slate-200 dark:bg-slate-900 px-4 py-2 w-11/12 md:w-6/12"
      onClick={e => closeModal(e)}
    >
      <div className="relative w-full py-3 border-b-2 border-slate-300 text-slate-600 focus-within:text-slate-400 dark:focus-within:text-slate-100">
        <span className="absolute left-0 top-4 flex items-center pl-2">
          <GoSearch size={24} />
        </span>
        <input
          autoFocus
          className="w-full py-2 text-sm text-white bg-slate-200 pl-12 focus:outline-none focus:text-slate-900 dark:bg-slate-900 dark:focus:text-slate-100"
          placeholder="Search OpenSea..."
          autoComplete="off"
          onChange={handleChange}
          value={state.OpenSeaSearch || ""}
          name="OpenSeaSearch"
        />
        <button
          className="absolute right-2 top-3 rounded-lg border dark:text-white px-2 py-1"
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
          <div className="flex h-24 w-full justify-center items-center">
            <h1 className="font-semibold">start typing...</h1>
          </div>
        </>
      )}
    </div>
  )
}

export default OsSearchBar

import React from "react"
import Link from "next/link"
import { GoSearch } from "react-icons/go"
import { useUiStore } from "stores/useUiStore"
import axios from "axios"
import ResultsLoading from "./ResultsLoading"
import CollectionsResultsSuccess from "./CollectionsResultsSuccess"
import ProfilesResultsSuccess from "./ProfilesResultsSuccess"
import DaosResultsSuccess from "./DaosResultsSuccess"
import CollectionAddedCard from "./CollectionAddedCard"

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
    const result = await axios.post(`${process.env.NEXT_PUBLIC_API}/search`, {
      query: query,
    })
    dispatch({ type: "fetch_success", payload: result.data })
  } catch (err) {
    dispatch({ type: "fetch_failure" })
    axios.isCancel(err) || dispatch({ type: "fetch_failure" })
  }
}

const AppSearch = () => {
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

  const appModalOpen = useUiStore(state => state.setAppModalOpen)
  const setAppModalOpen = useUiStore(state => state.setAppModalOpen)

  const handleKeyDown = event => {
    if (event.keyCode === 27) {
      if (appModalOpen) {
        setAppModalOpen()
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
    if (!appModalOpen && e.target) {
      return
    }
    setQuery("")
    setAppModalOpen()
  }

  return (
    <div
      className="z-50 mx-auto mt-0 flex h-full w-full flex-col bg-slate-200 px-4 py-2 shadow dark:bg-slate-900 md:mt-24 md:h-1/3 md:w-6/12 md:rounded-xl"
      onClick={e => closeModal(e)}
    >
      <div className="relative w-full border-b-2 border-slate-300 py-3 text-slate-600 focus-within:text-slate-400 dark:focus-within:text-slate-100">
        <span className="absolute left-0 top-4 flex items-center pl-2">
          <GoSearch size={24} />
        </span>
        <input
          autoFocus
          className="w-full bg-slate-200 py-2 pl-12 text-sm text-white focus:text-slate-900 focus:outline-none dark:bg-slate-900 dark:focus:text-slate-100"
          placeholder="Search..."
          autoComplete="off"
          onChange={event => setQuery(event.target.value)}
          value={query}
        />
        <button
          className="absolute right-2 top-3 rounded-lg border px-2 py-1 dark:text-white"
          onClick={setAppModalOpen}
        >
          esc
        </button>
      </div>

      {/* if there are hits in the search, pass them to Results */}
      {!query.length ? (
        <>
          <div className="flex h-24 w-full items-center justify-center">
            <h1 className="font-semibold">start typing...</h1>
          </div>
        </>
      ) : isLoading && query.length ? (
        <ResultsLoading />
      ) : (hits?.Collections?.length && query.length) ||
        (hits?.Profiles?.length && query.length) ||
        (hits?.Daos?.length && query.length) ? (
        <>
          {hits?.Collections.length ? (
            <CollectionsResultsSuccess
              hits={hits.Collections}
              closeModal={closeModal}
            />
          ) : (
            <></>
          )}
          {hits?.Profiles.length ? (
            <ProfilesResultsSuccess
              hits={hits.Profiles}
              closeModal={closeModal}
            />
          ) : (
            <></>
          )}
          {hits?.Daos.length ? (
            <DaosResultsSuccess hits={hits.Daos} closeModal={closeModal} />
          ) : (
            <></>
          )}
        </>
      ) : hits?.slug ? (
        <>
          <div className="flex h-24 w-full items-center justify-center">
            <CollectionAddedCard hit={hits} closeModal={closeModal} />
          </div>
        </>
      ) : (
        <ResultsLoading />
      )}
    </div>
  )
}

export default AppSearch

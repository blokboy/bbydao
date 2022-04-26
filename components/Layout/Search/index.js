import React from "react"
import ResultsLoading from "./ResultsLoading"
import UserResults from "./UserResults"
import axios from "axios"
import { GoSearch } from "react-icons/go"
import { MdClose } from "react-icons/md"
import { useLayoutStore } from "/stores/useLayoutStore"

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

const Search = () => {
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

  React.useEffect(() => {
    if (hits.length) {
      console.log(hits)
    }
  }, [hits])

  const setSearchOpen = useLayoutStore(state => state.setSearchOpen)

  return (
    <div className="flex flex-col w-full justify-center items-center px-3">
      {/* Search bar displays 1/2 width md breakpoint and full width on mobile*/}
      <div className="relative md:w-1/2 w-full border-b-2 border-slate-200 py-3 text-slate-600 focus-within:text-slate-400 dark:focus-within:text-slate-100">
        <span className="absolute left-0 top-4 flex items-center pl-2">
          <GoSearch size={24} />
        </span>
        <input
          autoFocus
          className="w-full bg-slate-300 py-2 pl-12 text-sm text-white focus:text-slate-900 focus:outline-none dark:bg-slate-900 dark:focus:text-slate-100"
          placeholder="Search..."
          autoComplete="off"
          onChange={event => setQuery(event.target.value)}
          value={query}
        />
        <button
          className="absolute right-2 top-3 rounded-full border p-1 hover:dark:bg-slate-800 hover:bg-slate-100 dark:text-white"
          onClick={setSearchOpen}
        >
          <MdClose size={24} />
        </button>
      </div>
      {/* RESULTS */}
      {/* if there are hits in the search, pass them to Results */}
      <div className="flex md:w-1/2 w-full">
        {!query.length ? (
          <>
            <div className="flex h-24 w-full items-center justify-center">
              <h1 className="font-semibold">start typing...</h1>
            </div>
          </>
        ) : isLoading && query.length ? (
          <ResultsLoading />
        ) : hits?.Profiles?.length && query.length ? (
          <UserResults hits={hits.Profiles} />
        ) : null}
      </div>
    </div>
  )
}

export default Search

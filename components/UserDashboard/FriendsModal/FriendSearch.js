import React from "react"
import { GoSearch } from "react-icons/go"
import { HiX } from "react-icons/hi"
import { useQuery } from "react-query"
import FriendSearchResults from "./FriendSearchResults"

const FriendSearch = ({ address, closeModal }) => {
  const [results, setResults] = React.useState([])

  const { data: friendData } = useQuery(
    ["friends", address],
    () => api.getFriends({ initiator: address }),
    {
      refetchOnWindowFocus: false,
      staleTime: 180000,
    }
  )
  console.log('frend data in serch ', friendData)

  const excludeColumns = [
    "createdAt",
    "id",
    "updatedAt",
  ]

  const filterFriends = value => {
    const lowercasedValue = value.toLowerCase().trim()
    if (lowercasedValue === "") setResults([])
    else {
      const filteredData = friendData.filter(item => {
        return Object.keys(item).some(key =>
          excludeColumns.includes(key)
            ? false
            : item[key]?.toString().toLowerCase().includes(lowercasedValue)
        )
      })
      setResults(filteredData)
    }
  }
  const parsedResults = React.useMemo(() => {
    const followers = []
    const frens = []

    for(const result of results) {
      if(result.status === 4) {
        followers.push(result)
      }
      if(result.status === 1) {
        frens.push(result)
      }
    }

    return { frens, followers }
  })
  console.log('results after filter data ', parsedResults)

  return (
    <div
      className="z-50 mx-auto mt-0 flex h-full w-full flex-col bg-slate-200 px-4 py-2 shadow dark:bg-slate-900 md:mt-24 md:h-1/2 md:w-6/12 md:rounded-xl"
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
          onChange={event => filterFriends(event.target.value)}
        />
        <button
          className="absolute right-2 top-3 rounded-full border px-2 py-1 dark:text-white"
          onClick={e => closeModal(e)}
        >
          <HiX />
        </button>
      </div>

      {!results.length ? (
        <>
          <div className="flex h-24 w-full items-center justify-center">
            <h1 className="font-semibold">start typing...</h1>
          </div>
        </>
      ) : results.length ? (
        <FriendSearchResults friends={parsedResults.frens} closeModal={closeModal} follows={parsedResults.followers} />
      ) : (
        <></>
      )}
    </div>
  )
}

export default FriendSearch

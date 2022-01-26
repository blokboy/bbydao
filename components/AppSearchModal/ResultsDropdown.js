import React from "react"
import { useQuery } from "react-query"
import * as api from "query"
import ResultCard from "./ResultCard"

const ResultsDropdown = () => {
  // replace this query with search results from SearchForm.js
  const { data } = useQuery("users", api.getUsers)

  return (
    <div className="my-2 flex flex-col py-2">
      {data?.map(user => (
        <ResultCard key={user.id} address={user.address} />
      ))}
    </div>
  )
}

export default ResultsDropdown

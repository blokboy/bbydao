import React, { useEffect, useState } from "react"
import { useQuery } from "react-query"
import NurseryCard from "./NurseryCard"
import * as api from "query"
import CreateNurseryBtn from "../CreateNurseryBtn"

const NurseryList = ({ safeAddress }) => {
  const [nurseries, setNurseries] = useState()

  const { data, isFetching, isFetched } = useQuery(
    ["nurseries", safeAddress],
    () => api.getTenancy({ address: safeAddress }),
    {
      refetchOnWindowFocus: true,
    }
  )

  useEffect(() => {
    if(isFetched) {
      setNurseries(data)
    }
  }, [])

  console.log('nurseries ', nurseries)
  return (
    <div className="mx-2 mb-3 flex flex-col rounded-xl bg-slate-200 p-3 shadow-xl dark:bg-slate-900">
      <h1>Nursery List</h1>
      <div className="m-2 flex flex-col rounded-xl bg-slate-300 p-2 shadow-xl dark:bg-slate-800">
        {
          nurseries ? !nurseries?.length && (
            <div className="flex justify-center align-center">
             <CreateNurseryBtn />
            </div>
           
          ) : (
            <div>
              {
                nurseries?.length && nurseries?.map(nursery => {
                  return <NurseryCard nursery={nursery} />
                })
              }
            </div>
          )
        }
      </div>
    </div>
  )
}

export default NurseryList

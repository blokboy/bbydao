import React from "react"
import { useQuery } from "react-query"
import * as api from "query"

export default function useNotifications(address = "") {
  const { data } = useQuery(["notifications"], () => api.userNotifications({ target: address }), {
    enabled: !!address,
    staleTime: 180000,
  })

  console.log("useNotifications data", data)

  return React.useMemo(() => {
    if (!data || !address) {
      return []
    }

    return data
  }, [data, address])
}

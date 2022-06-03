import React from "react"
import axios from "axios"
import { useQuery, useQueryClient } from "react-query"
import { useAccount } from "wagmi"

export default function useDAOs() {
  const { data: account } = useAccount()
  const queryClient = useQueryClient()

  const getDAOs = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`https://safe-transaction.gnosis.io/api/v1/owners/${account?.address}/safes/`)
      return data
    } catch (err) {
      console.log(err)
    }
  }, [account])

  return useQuery("daos", getDAOs, { initialData: queryClient.getQueryData("daos") ?? [], enabled: !!account?.address })
}

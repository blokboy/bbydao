import React from "react"

import * as api from "/query"
import { useQuery } from "react-query"

const DaoToDaoFollowModal = ({ user, targetDao }) => {
  console.log("DaoToDaoFollowModal user:", user, "targetDao:", targetDao)

  // const { data: userDaos } = useQuery(["userDaos", user], () => api.getUserDaos({ address: user }))
  // console.log("DaoToDaoFollowModal userDaos:", userDaos)

  return <div>DaoToDaoFollowModal</div>
}

export default DaoToDaoFollowModal

import React from "react"

import * as api from "/query"
import * as gnosisApi from "query/gnosisQuery"
import { useQuery } from "react-query"

export const DaoCard = ({ address }) => {
  const { data: daoData, isLoading: daoIsLoading } = useQuery(["dao", address], () => api.getDao({ address: address }), {
    staleTime: 180000,
    refetchOnWindowFocus: false,
  })
  
  return <div className='w-full p-2'>{daoData?.name || 'yoo'}</div>
}

const DaoToDaoFollowModal = ({ user, targetDao }) => {
  console.log("DaoToDaoFollowModal user:", user, "targetDao:", targetDao)

  const { data: userDaos, isLoading: userDaosLoading } = useQuery(
    ["userDaos", user],
    () => gnosisApi.safesByOwner(user),
    {
      staleTime: 180000,
      refetchOnWindowFocus: false,
    }
  )

  // get all safes that a user is an owner/member of
  // display safes with their names from our api as options
  // user chooses one or more options, these will be initiators of the relationship
  // targetDao is the target of the relationship
  // submit button will create each relationship

  // const { data: userDaos } = useQuery(["userDaos", user], () => api.getUserDaos({ address: user }))
  // console.log("DaoToDaoFollowModal userDaos:", userDaos)

  const DaoCards = React.useMemo(() => {
    if (userDaos?.safes) {
      return userDaos.safes.map(address => {
        return <DaoCard key={address} address={address} />
      })
    }
  }, [userDaos])

  return (
    <div className='w-full'>
      <div className='w-full'>{DaoCards}</div>
    </div>
  )
}

export default DaoToDaoFollowModal
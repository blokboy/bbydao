import React, { useMemo } from "react"
import { useMutation, useQuery } from "react-query"
import { useAccount, useEnsName } from "wagmi"
import * as api from "query"
import Feed from "./Feed"
import UserDaos from "./UserDaos"
import UserPanel from "./UserPanel"

const Playground = ({ address, data }) => {
  // data is the res from querying gnosis for the user's daos
  // address is the address of the profile being viewed
  // data: userData is the data of the signed-in user
  const { data: userData, error: userErr, loading: userLoading } = useAccount()
  const { data: ensData, isError: ensError, isloading: ensLoading } = useEnsName({ address: address })

  // getUser sends a POST req to our api with the address of the profile being viewed
  // if that address does not exist in our backend, it creates a new user record
  const { mutateAsync: updateUser } = useMutation(api.updateUser, { refetchOnWindowFocus: false })
  const {
    data: getAddressData,
    status: getAddressStatus,
    mutateAsync: getAddress,
  } = useMutation(api.getUser, {
    // working out how to access this, how we can treat it the same as the data from a useQuery
    mutationKey: ["address data", address],
    // staleTime: 180000,
    // refetchOnWindowFocus: false,
  })

  // this useEffect is intended to fire when ensLoading from wagmi is false (to see if an ens lookup was successful)
  // if the ens lookup was successful, and the user ens on our backend does not match the ens lookup from wagmi,
  // we update the user's ens on our backend to match the ens lookup from wagmi
  React.useEffect(() => {
    if (ensLoading) {
      return
    }
    const req = { address: address, ens: ensData }
    getAddress(req, {
      onSuccess: () => {
        if (getAddressData?.ens !== ensData) {
          updateUser({ id: getAddressData.id, ens: ensData })
        }
      },
    })
  }, [ensLoading])

  /*  Set currently viewed profile in React Query cache -- accessible with queryKey "targetAddress" */
  useQuery("targetAddress", () => api.getUser({ address }), {
    enabled: !!address,
    retryOnMount: true,
    refetchOnWindowFocus: false,
    // staleTime: Infinity,
  })

  // i think there's an opportunity to toggle UserDaos out for another set of components
  // Feed and UserDaos(or a component that contains UserDaos / toggles it out) are intended
  // to interact with each other, actions taken in both sections should lead to discovery
  // and exploration of the app - making each column or section modular could provide unique
  // user paths and experiences - bbyDAO and user discovery/connection'

  return (
    <div className="flex w-full flex-col lg:flex-row">
      <UserPanel user={userData?.address} address={address} />
      <UserDaos user={userData?.address} data={data} address={address} />
      <Feed />
    </div>
  )
}

export default Playground

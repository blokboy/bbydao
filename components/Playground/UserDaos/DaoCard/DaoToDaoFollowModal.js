import React from "react"
import * as api from "/query"
import * as gnosisApi from "query/gnosisQuery"
import { useQuery, useMutation, useQueryClient } from "react-query"

export const DaoCard = ({ address, targetDao, isFollowing }) => {
  const { data: daoData, isLoading: daoIsLoading } = useQuery(
    ["dao", address],
    () => api.getDao({ address: address }),
    {
      staleTime: 180000,
      refetchOnWindowFocus: false,
    }
  )

  const { data: daoDaoRel } = useQuery(["daoDaoRel", [address, targetDao]], () => api.getRelationshipBy({ initiator: address, target: targetDao }), {
    enabled: !!isFollowing,
    refetchOnWindowFocus: false,
    staleTime: 180000,
  })
  console.log("daoDaoRel", daoDaoRel)

  const queryClient = useQueryClient()
  const { status, mutateAsync: followDao } = useMutation(api.reqRelationship, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["daoFollowers", targetDao], {
        refetchActive: true,
      })
      await queryClient.invalidateQueries(["daoDaoRel", [address, targetDao]], {
        refetchActive: true,
      })
    },
  })

  const { mutateAsync: unfollowDao } = useMutation(api.deleteRelationship, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["daoFollowers", targetDao], {
        refetchActive: true,
      })
      await queryClient.invalidateQueries(["daoDaoRel", [address, targetDao]], {
        refetchActive: true,
      })
    },
  })

  const handleFollow = () => {
    if (isFollowing) {
      unfollowDao({ id: daoDaoRel?.id })
    } else {
      followDao({ initiator: address, target: targetDao, status: 1 })
    }
  }

  const btn = React.useMemo(() => {
    return (
      <button
        className={"w-full rounded-lg bg-slate-100 p-2 dark:bg-slate-800" + (isFollowing ? " text-green-500" : "")}
        onClick={handleFollow}
      >
        {daoData?.name || "yoo"}
      </button>
    )
  }, [isFollowing])

  return btn
}

const DaoToDaoFollowModal = ({ user, targetDao }) => {
  const {data: followers} = useQuery(["daoFollowers", targetDao], () => api.getFollowers({ target: targetDao }))
  const currentRelationships = followers?.filter(rel => rel.status === 1).map(rel => rel.initiator)

  const { data: userDaos, isLoading: userDaosLoading } = useQuery(
    ["userDaos", user],
    () => gnosisApi.safesByOwner(user),
    {
      staleTime: 180000,
      refetchOnWindowFocus: false,
    }
  )

  const DaoCards = React.useMemo(() => {
    if (userDaos?.safes) {
      return userDaos.safes.map(address => {
        return (
          <DaoCard
            key={address}
            address={address}
            targetDao={targetDao}
            isFollowing={currentRelationships?.includes(address)}
          />
        )
      })
    }
  }, [userDaos, currentRelationships])

  return (
    <div className="flex w-full flex-col space-y-2">
      <div className="flex flex-col space-y-2">{DaoCards}</div>
    </div>
  )
}

export default DaoToDaoFollowModal

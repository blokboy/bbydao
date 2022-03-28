import React        from "react"
import Link         from "next/link"
import Davatar      from "@davatar/react"
import { useQuery } from "react-query"
import * as api     from "../../query"

const DaoDetail = ({ safe }) => {
  if (!safe) {
    return <></>
  }

  const { data } = useQuery(
    ["daoDetail"],
    () => api.getDao({ safe }),
    { staleTime: 180000 }
  )

  return (
    <>
      <Link href={safe ? `/dao/${safe}` : "/"}>
        <a>
          <div className="flex flex-col text-center">
            {(!!data?.imgUri && (
              <div className="rounded-full h-44 w-44 overflow-hidden">
                <img src={data.imgUri} className="w-full" alt="bbydao image" />
              </div>
            )) || (
              <Davatar size={175} address={safe} generatedAvatarType="blockies" />
            )}
            <span className="mt-2 bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text text-sm text-transparent">
              {!!data?.name ? data.name : safe.substring(0, 12) + "..."}
            </span>
          </div>
        </a>
      </Link>
    </>
  )
}

export default DaoDetail

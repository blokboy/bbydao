import React, { useEffect, useState }        from "react"
import Link         from "next/link"
import Davatar      from "@davatar/react"
import { useQuery, useMutation } from "react-query"
import * as api     from "../../query"
import SafeServiceClient from "@gnosis.pm/safe-service-client"

const DaoDetail = ({ safe }) => {
  if (!safe) {
    return <></>
  }
  const { mutateAsync } = useMutation(api.createDao,{
      onCompleted: (data) =>{
        setDaoData(data)
      },
      onError: (e) => {
        console.log("Error while retrieving dao in DaoDetail", e)
      }
  })
  const [daoData, setDaoData ] = useState({})
  const { data, error, isLoading } = useQuery(
    [`${safe}`],
    () => api.getDao({ address: safe }),
    { staleTime: 180000 }
  )

  useEffect(() => {
    if(data && !isLoading){
      setDaoData(data)
    } else if (!data && !isLoading && !error){
      // we're here if dao data is empty (meaning no data in backend)
      createDaoInBackendAsync()
    }

    // if we set up a logger, lets log the error
  }, [data, daoData])

  const createDaoInBackendAsync = async () => {
    try {
      const safeService = new SafeServiceClient(
        "https://safe-transaction.gnosis.io"
      )

      console.log("No dao found, creating a new one now", safe)
      const safeInfo = await safeService.getSafeInfo(safe)
      const req = {
        name: `${safe.substring(0,12)}...`,
        type: 1,
        address: safe,
        members: safeInfo.owners
      }

      mutateAsync(req)
        
    } catch (error) {
      console.log("DaoDetail",error)
    }
  }  


  return (
    <>
      <Link href={safe ? `/dao/${safe}` : "/"}>
        <a>
          <div className="flex flex-col text-center">
            {(!!daoData?.imgUri && (
              <div className="rounded-full h-44 w-44 overflow-hidden">
                <img src={daoData.imgUri} className="w-full" alt="bbydao image" />
              </div>
            )) || (
              <Davatar size={175} address={safe} generatedAvatarType="blockies" />
            )}
            <span className="mt-2 bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text text-sm text-transparent">
              {!!daoData?.name ? daoData.name : (
              <div className="flex w-full animate-pulse space-x-2">
                <div className="h-4 w-8/12 rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32]"></div>
              </div>
            )}
            </span>
          </div>
        </a>
      </Link>
    </>
  )
}

export default DaoDetail

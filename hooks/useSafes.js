import React from "react"
import SafeServiceClient from "@gnosis.pm/safe-service-client"



const useSafes = (address = "") => {
    const [safes, setSafes] = React.useState()
    
    React.useEffect(() => {
        getUserSafes()
    }, [])

    const getUserSafes = async () => {
        if (!address) return
        const safeService = new SafeServiceClient(
            "https://safe-transaction.gnosis.io"
        )
        const safes = await safeService.getSafesByOwner(address)
        setSafes(safes.safes)
    }

    return safes 
}

export default useSafes
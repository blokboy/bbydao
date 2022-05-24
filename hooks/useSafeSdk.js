import Safe, { EthersAdapter } from "@gnosis.pm/safe-core-sdk"
import { ethers } from "ethers"
import React, { useState } from "react"
import { useLayoutStore } from "../stores/useLayoutStore"

export default function useSafeSdk(safeAddress) {
  const signer = useLayoutStore(state => state.signer)
  const [sdkInstance, setSdkInstance] = useState(null)

  const handleSdkInstance = React.useCallback(async () => {
    if (sdkInstance !== null) {
      return
    }

    try {
      if (!signer) {
        throw new Error("there is no signer")
      }

      const ethAdapter = new EthersAdapter({ ethers, signer })
      const safeSdk = await Safe.create({
        ethAdapter,
        safeAddress,
      })
      setSdkInstance(safeSdk)
    } catch (err) {
      console.log("err", err)
    }
  }, [safeAddress, signer])

  React.useEffect(() => {
    if (signer) {
      handleSdkInstance()
    }
  }, [handleSdkInstance, signer])

  return sdkInstance
}

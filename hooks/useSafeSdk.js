import Safe, { EthersAdapter } from "@gnosis.pm/safe-core-sdk"
import { ethers } from "ethers"
import React, { useEffect, useState } from "react"
import { useSigner } from "wagmi"

export default function useSafeSdk(safeAddress) {
  const [{ data: signer, loading }] = useSigner()
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

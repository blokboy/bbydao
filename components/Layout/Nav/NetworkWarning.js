import { useMemo } from "react"
import { useNetwork } from "wagmi"

export default function NetworkWarning() {
  const { data: network } = useNetwork()

  const isWrongNetwork = useMemo(() => {
    if (!network?.chain) {
      return false
    }

    return network.chain?.id !== 1
  }, [network])

  return useMemo(() => {
    return isWrongNetwork ? (
      <div className="bg-red-600 p-4 text-white">
        <div className="m-auto flex w-full max-w-6xl items-center justify-center text-center">
          <p>
            {!!network?.chain ? "Please switch network to the Ethereum mainnet" : "Connect wallet to Ethereum mainnet"}
          </p>
        </div>
      </div>
    ) : null
  }, [isWrongNetwork])
}

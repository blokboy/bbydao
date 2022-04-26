import { useMemo } from "react"
import { useNetwork } from "wagmi"

export default function NetworkWarning() {
  const [{ data: network }] = useNetwork()

  const isWrongNetwork = useMemo(() => {
    if (!network) {
      return false
    }

    return network.chain?.id !== 1
  }, [network])

  return useMemo(() => {
    return isWrongNetwork ? (
      <div className="bg-red-600 p-4 text-white">
        <div className="flex w-full max-w-6xl m-auto items-center justify-center text-center">
          <p>Please switch network to the Ethereum mainnet!</p>
        </div>
      </div>
    ) : null
  }, [isWrongNetwork])
}

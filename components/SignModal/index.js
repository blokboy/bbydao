import React from "react"
import { verifyMessage } from "ethers/lib/utils"
import { useSignMessage } from "wagmi"

const SignModal = () => {
  const previousMessage = React.useRef()
  const [message, setMessage] = React.useState("")
  const [{ data, error, loading }, signMessage] = useSignMessage()

  const recoveredAddress = React.useMemo(() => {
    if (!data || !previousMessage.current) return undefined
    return verifyMessage(previousMessage.current, data)
  }, [data, previousMessage])

  // just testing
  React.useEffect(() => {
    console.log("data:", data)
  }, [data, recoveredAddress])

  // structure as steps
  // aprove transactions sig
  // reject transactions sig
  // button to skip?

  return (
    <div className="fixed z-40 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div
        onSubmit={event => {
          event.preventDefault()
          previousMessage.current = message
          signMessage({ message })
        }}
      >
        <label htmlFor="message">Enter a message to sign</label>
        <textarea
          id="message"
          placeholder="The quick brown fox…"
          onChange={event => setMessage(event.target.value)}
        />
        <button disabled={loading || !message.length}>
          {loading ? "Check Wallet" : "Sign Message"}
        </button>

        {data && (
          <div>
            <div>Recovered Address: {recoveredAddress}</div>
            <div>Signature: {data}</div>
          </div>
        )}
        {error && <div>{error?.message ?? "Error signing message"}</div>}
      </div>
    </div>
  )
}

export default SignModal

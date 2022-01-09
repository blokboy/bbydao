import React from "react"
// import { verifyMessage } from "ethers/lib/utils"
import { useSignMessage } from "wagmi"
import * as api from "query"
import { useMutation } from "react-query"

const SignModal = ({ incomingUser }) => {
  console.log("incomingUser:", incomingUser)

  const { status, mutateAsync } = useMutation(api.updateUser)

  const message = "babydao: approve transactions"
  const [{ data: approveData, error, loading }, signMessage] = useSignMessage({
    message: message,
  })

  const handleRequest = req => {
    mutateAsync(req, {
      onSuccess: data => {
        console.log("sign mutation success:", data)
      },
      onSettled: data => {
        console.log("sign mutation settled:", data)
      },
    })
  }

  React.useEffect(() => {
    if (!approveData || !message) return undefined

    // const verified = verifyMessage(message, approveData)

    const req = {
      id: incomingUser.id,
      approveSignature: approveData,
      confirmed: true,
    }

    console.log("PUT", req)

    // handleRequest(req)
    // mutateAsync(req, {
    //   onSuccess: res => {
    //     console.log("sign mutation success:", res.data)
    //   },
    //   onSettled: res => {
    //     console.log("sign mutation settled:", res.data)
    //   },
    // })
  }, [approveData]) /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <div className="fixed z-40 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <form
        className="flex flex-col z-50 mt-24 mx-auto rounded-xl shadow bg-gray-200 dark:bg-gray-900 px-4 py-2 w-11/12 md:w-6/12"
        onSubmit={event => {
          event.preventDefault()
          signMessage()
        }}
      >
        {approveData ? (
          <span>success</span>
        ) : (
          <button disabled={loading}>
            {loading ? "Check Wallet" : "Sign Message"}
          </button>
        )}

        {/* {data && (
          <div>
            <div>Recovered Address: {recoveredAddress}</div>
            <div>Signature: {data}</div>
          </div>
        )}

        {error && <div>{error?.message ?? "Error signing message"}</div>} */}
      </form>
    </div>
  )
}

export default SignModal

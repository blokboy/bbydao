import React from "react"

const ApproveReject = ({ tx }) => {
  const { type, txHash } = tx

  const handleApprove = async e => {
    e.preventDefault()
    console.log("approve type", type)
    console.log("approve hash", txHash)
  }

  const handleReject = async e => {
    e.preventDefault()
    console.log("reject type", type)
    console.log("reject hash", txHash)
  }

  return (
    <>
      <button
        className="mr-1 rounded-lg bg-red-400 p-1 text-xs shadow-sm hover:bg-red-600"
        onClick={handleReject}
      >
        reject
      </button>
      <button
        className="rounded-lg bg-green-400 p-1 text-xs shadow-sm hover:bg-green-600"
        onClick={handleApprove}
      >
        approve
      </button>
    </>
  )
}

export default ApproveReject

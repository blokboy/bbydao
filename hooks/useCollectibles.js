import React from "react"
import SafeServiceClient from "@gnosis.pm/safe-service-client"

const safeService = new SafeServiceClient("https://safe-transaction.gnosis.io")

export default function useCollectibles(address = "", { skip }) {
  const initState = {
    status: "idle",
    collectibles: [],
  }

  const [state, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case "start":
        return { ...state, status: "pending" }
      case "error":
        return { ...state, status: "rejected" }
      case "success":
        return { ...state, status: "resolved", collectibles: action.payload.collectibles }
      default:
        throw new Error("unsupported action type given on useCollectibles reducer")
    }
  }, initState)

  const handleCollectibles = React.useCallback(async () => {
    if (!address || !safeService) {
      return
    }

    try {
      const collectibles = await safeService.getCollectibles(address)
      dispatch({ type: "success", payload: { collectibles } })
    } catch (err) {
      dispatch({ type: "error" })
    }
  }, [address, safeService])

  const loading = React.useMemo(() => {
    return ["idle", "pending"].includes(state.status)
  }, [state.status])

  const error = React.useMemo(() => {
    return state.status === "rejected"
  }, [state.status])

  React.useEffect(() => {
    if (state.status === "idle" && !skip) {
      handleCollectibles()
    }
  }, [handleCollectibles, state.status])

  const getCollectibles = handleCollectibles

  return [{ data: state.collectibles, loading, error }, getCollectibles]
}

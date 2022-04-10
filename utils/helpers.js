import { isAddress } from "ethers/lib/utils"
import React from "react"

export const walletSnippet = addr => {
  if (!addr) {
    return null
  }

  return isAddress(addr)
    ? addr.substring(0, 5) +
        "..." +
        addr.substring(addr.length - 5, addr.length)
    : addr
}

export const debounce = (func, wait) => {
  let timeout

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

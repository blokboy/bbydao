import { isAddress } from "ethers/lib/utils"
import React         from "react"

export const walletSnippet = (addr) => {
  let snippet = ''
  if(!!addr) {
    if(isAddress(addr)) {
      snippet = addr.substring(0, 5) + '...' + addr.substring(addr.length - 5, addr.length)
    } else {
      snippet = addr
    }

    return snippet
  }
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

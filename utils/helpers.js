import React from "react"

export const walletSnippet = (addr) =>
    addr.substring(0, 5) + '...' + addr.substring(addr.length - 5, addr.length)

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
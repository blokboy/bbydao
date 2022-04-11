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


/**
 * Determines whether an object is empty or not.
 *
 * @param object
 * @returns {boolean}
 */
export const isEmpty = object => {
  for (let key in object) {
    if (object.hasOwnProperty(key)) return false
  }
  return true
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

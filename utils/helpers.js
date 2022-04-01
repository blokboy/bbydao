import React from "react"

export const walletSnippet = (addr) =>
    addr.substring(0, 5) + '...' + addr.substring(addr.length - 5, addr.length)

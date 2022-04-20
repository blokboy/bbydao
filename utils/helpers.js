import { isAddress } from "ethers/lib/utils"
import React from "react"

/**
 * Create snippet of wallet address or
 * return address if it is not a "address"
 * as defined by Ethers.
 *
 * @param addr
 * @returns {string || null}
 */

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

/**
 * Converts BigInt to Number
 *
 * @params (balance, decimals)
 * @returns {number}
 */

export const NumberFromBig = (balance, decimals) =>
    Number((balance / 10 ** decimals).toString().match(/^\d+(?:\.\d{0,3})?/))

/**
 * Max Value of BigInt
 * @returns {BigInt}
 */
export const max256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'


/******************************************************************
 * Converts e-Notation Numbers to Plain Numbers
 ******************************************************************
 * @function eToNumber(number)
 * @version  1.00
 * @param   {enotation Number} valid Number in exponent format.
 *          pass number as a string for very large 'e' numbers or with large fractions
 *          (none 'e' number returned as is).
 * @return  {string}  a decimal number string.
 * @author  Mohsen Alyafei
 * @date    17 Jan 2020
 *
 *****************************************************************/

export const eToNumber = (num) => {
  if(!!num) {
    let sign = "";
    (num += "").charAt(0) == "-" && (num = num.substring(1), sign = "-")
    let arr = num.split(/[e]/ig)
    if (arr.length < 2) return sign + num
    let dot = (.1).toLocaleString().substr(1, 1), n = arr[0], exp = +arr[1],
        w = (n = n.replace(/^0+/, '')).replace(dot, ''),
        pos = n.split(dot)[1] ? n.indexOf(dot) + exp : w.length + exp,
        L   = pos - w.length, s = "" + BigInt(w)
    w   = exp >= 0 ? (L >= 0 ? s + "0".repeat(L) : r()) : (pos <= 0 ? "0" + dot + "0".repeat(Math.abs(pos)) + s : r())
    L= w.split(dot); if (L[0]==0 && L[1]==0 || (+w==0 && +s==0) ) w = 0;
    return sign + w;
    function r() {return w.replace(new RegExp(`^(.{${pos}})(.)`), `$1${dot}$2`)}
  }

}

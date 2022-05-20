import axios from "axios"

const api = axios.create({ baseURL: "https://safe-transaction.gnosis.io/api/v1/" })

export const daoBalance = async safeAddress => {
  const { data } = await api.get(`safes/${safeAddress}/balances/usd/?trusted=false&exclude_spam=false`)
  return data
}

export const daoMembers = async safeAddress => {
  const { data } = await api.get(`safes/${safeAddress}/`)
  return data.owners
}

export const daoNFTs = async safeAddress => {
  const { data } = await api.get(`safes/${safeAddress}/collectibles/?trusted=false&exclude_spam=false`)
  return data
}

export const daoTokens = async safeAddress => {
  const { data } = await api.get(`safes/${safeAddress}/balances/?trusted=false&exclude_spam=false`)
  return data
}

export const allDaoTx = async safeAddress => {
  const { data } = await api.get(`safes/${safeAddress}/all-transactions/?ordering=submissionDate&executed=false&queued=true&trusted=true`)
  return data
}

export const safesByOwner = async address => {
  const { data } = await api.get(`/owners/${address}/safes/`)
  return data
}



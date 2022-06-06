import axios from "axios"

const api = axios.create({ baseURL: "https://safe-transaction.gnosis.io/api/v1/" })
const clientApi = axios.create({baseURL: "https://safe-client.gnosis.io/v1/chains/1/"})

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

export const daoTxConfs = async safeTxHash => {
  const { data } = await api.get(`multisig-transactions/${safeTxHash}/confirmations/`)
  return data
}

export const allDaoTx = async safeAddress => {
  const { data } = await api.get(`safes/${safeAddress}/all-transactions/?ordering=submissionDate&executed=false&queued=true&trusted=true`)
  return data
}

export const daoTxHistory = async safeAddress => {
  const { data } = await clientApi.get(`safes/${safeAddress}/transactions/history`)
  return data
}

export const daoTxQueued = async (safeAddress, page) => {
  const { data } = await clientApi.get(!!page ? page : `/safes/${safeAddress}/transactions/queued`)
  return data
}

export const safesByOwner = async signerAddress => {
  const { data } = await api.get(`owners/${signerAddress}/safes`)
  return data
}



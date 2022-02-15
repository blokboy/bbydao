import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
})

// get user
// { address: 0x... , ens: string || null, ensAvatar: string || null }
export const getUser = async req => {
  const res = await api.post("/accounts/account", req)
  return res.data
}

// get user friends
// "/relationship/user"
// POST { initiator: address }
export const getFriends = async req => {
  const res = await api.post("/relationship/user", req)
  return res.data
}

// get all users
export const getUsers = async () => {
  const res = await api.get("/accounts")
  return res.data
}

// update user
// { id: id, username: string, email: string, ens: string }
export const updateUser = async req => {
  const res = await api.put("/accounts", req)
  console.log("query: Update User", res.data)
  return res.data
}

// request relationship
// { initiatorId: id, targetId: id, status: enum }
export const reqRelationship = async req => {
  const res = await api.post("/relationship/create", req)
  console.log("reqRelationship response:", res.data)
  return res.data
}

// update relationship
// { id: id, status: enum }
export const updateRelationship = async req => {
  const res = await api.put("/relationship", req)
  // console.log(res.data)
  return res.data
}

// get users notifications
// { target: address }
export const userNotifications = async req => {
  const res = await api.post("/notification/account", req)
  return res.data
}

// update notification status
// { seen: true }
export const updateNotification = async req => {
  const res = await api.put("/notification", req)
  return res.data
}

// delete notification
// { id: id }
export const deleteNotification = async req => {
  const res = await api.post("/notification/delete", req)
  return res.data
}

// storeTxOffChain
/* { 
  creator: string,
  txHash: string, 
  tokenContract: string, 
  tokenId: string, 
  safeContract: string,
  value: string,
  type: enum
}
*/
export const storeTxOffChain = async req => {
  const res = await api.post("/transaction", req)
  return res.data
}

// mutate off chain tx
// { id: id, approvals: [creator address] }
export const mutateOffChainTx = async req => {
  const res = await api.put("/transaction", req)
  return res.data
}

// delete off chain tx
// { id: id }
export const deleteOffChainTx = async req => {
  const res = await api.delete("/transaction", req)
  return res.data
}

// create dao
// { name: string, type: enum, address: string }
export const createDao = async req => {
  const res = await api.post("/dao/create", req)
  return res.data
}

// update dao properties
// {  id: id, name: string, imgUri: string }
export const updateDao = async req => {
  const res = await api.put("/dao", req)
  return res.data
}

// get user threads for message drop down
// { address: string }
export const getUserThreads = async req => {
  const res = await api.post("/member/threads", req)
  return res.data
}

// get thread messages
// { channel: string }
export const getThreadMessages = async req => {
  const res = await api.post("/message/channel", req)
  return res.data
}

// create messages
// { sender: string (req), body: string (req), channel: string (semi-req), addresses: (semi-req) }
export const createMessage = async req => {
  const res = await api.post("/message", req)
  return res.data
}

// query for infinite scroll on os collections
// { slug: string, address: string, offset: num }
export const getOsAssets = async req => {
  const res = await api.post("/collection/fetch", req)
  return res.data
}

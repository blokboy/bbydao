import axios from "axios"

const api = axios.create({
  baseURL: "https://minidao.herokuapp.com/",
})

// get user
// { address: 0x... , ens: string || null, ensAvatar: string || null }
export const getUser = async req => {
  const res = await api.post("/accounts/account", req)
  return res.data
}

// get user friends
// "/relationship/relationship"
// POST { initiatorId: id, targetId: id } - both logged in users id
export const getFriends = async req => {
  const res = await api.post("/relationship/relationship", req)
  return res.data
}

// get all users
export const getUsers = async () => {
  const res = await api.get("/accounts")
  return res.data
}

// update user
// { id: id, username: string, email: string }
export const updateUser = async req => {
  const res = await api.put("/accounts", req)
  console.log("query: Update User", res.data)
  return res.data
}

// request relationship
// { initiatorId: id, targetId: id, status: enum }
export const reqRelationship = async req => {
  const res = await api.post("/relationship/create", req)
  console.log("reqRelationship response:", data)
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

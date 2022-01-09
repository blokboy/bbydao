import axios from "axios"

const api = axios.create({
  baseURL: "https://minidao.herokuapp.com/",
})

// get user
// { address: 0x... , ens: string || null, ensAvatar: string || null }
export const getUser = async req => {
  const data = await api.post("/accounts/account", req)
  return data
}

// get all users
export const getUsers = async () => {
  const data = await api.get("/accounts")
  return data
}

// update user
// { id: id, username: string, email: string }
export const updateUser = async req => {
  const data = await api.put("/accounts", req)
  console.log("query: Update User", data)
  return data
}

// request relationship
// { initiatorId: id, targetId: id, status: enum }
export const reqRelationship = async req => {
  const data = await api.post("/relationship/create", req)
  console.log("reqRelationship response:", data)
  return data
}

// update relationship
// { id: id, status: enum }
export const updateRelationship = async req => {
  const data = await api.put("/relationship", req)
  // console.log(res.data)
  return data
}

// get users notifications
// { target: id }
export const userNotifications = async req => {
  const data = await api.post("/notification/account", req)
  // console.log("notifications in query:", data)
  return data
}

// update notification status
// { seen: true }
export const updateNotification = async req => {
  const data = await api.put("/notification", req)
  return data
}

// delete notification
// { id: id }
export const deleteNotification = async req => {
  const data = await api.post("/notification/delete", req)
  return data
}

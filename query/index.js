import axios from "axios"

const api = axios.create({
  baseURL: "https://minidao.herokuapp.com/",
})

// get all users
export const getUsers = () => api.get("/accounts").then(res => res.data)

// update user
// { id: id, username: string, email: string }
export const updateUser = req => {
  api.put("/accounts", req).then(res => res.data)
}

// request relationship
// { initiatorId: id, targetId: id, status: enum }
export const reqRelationship = req => {
  api.post("/relationship/create", req).then(res => {
    console.log("reqRelationship response:", res.data)
    return res.data
  })
}

// update relationship
// { id: id, status: enum }
export const updateRelationship = req => {
  api.put("/relationship", req).then(res => {
    console.log(res.data)
    res.data
  })
}

// get users notifications
// { target: id }
export const userNotifications = req =>
  api.post("/notification/account", req).then(res => res.data)

// update notification status
// { seen: true }
export const updateNotification = req => {
  api.put("/notification", req).then(res => res.data)
}

// delete notification
// { id: id }
export const deleteNotification = req =>
  api.post("/notification/delete", req).then(res => res.data)

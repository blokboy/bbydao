import React from "react"

const useForm = () => {
  const [state, setState] = React.useState({})

  const handleChange = e => {
    e.persist()
    setState(state => ({ ...state, [e.target.name]: e.target.value }))
  }

  return { state, setState, handleChange }
}

export default useForm

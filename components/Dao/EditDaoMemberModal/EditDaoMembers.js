import React from "react"
import axios from "axios"
import { GoSearch } from "react-icons/go"
import EditDaoMemberCard from "./EditDaoMemberCard"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

const reducer = (state, action) => {
  switch (action.type) {
    case "fetch_start":
      return {
        ...state,
        isLoading: true,
        hasError: false,
      }
    case "fetch_success":
      return {
        ...state,
        isLoading: false,
        hasError: false,
        hits: action.payload,
      }
    case "fetch_failure":
      return {
        ...state,
        isLoading: false,
        hasError: true,
      }
    default:
      throw new Error()
  }
}

const fetchHits = async (query, dispatch) => {
  dispatch({ type: "fetch_start" })
  try {
    // call to our backend to return search results for friends / members available to add to the dao
    // const result = await axios.post(`${process.env.NEXT_PUBLIC_API}/search`, {
    //   query: query,
    // })
    dispatch({ type: "fetch_success", payload: result.data })
  } catch (err) {
    dispatch({ type: "fetch_failure" })
    axios.isCancel(err) || dispatch({ type: "fetch_failure" })
  }
}

const EditDaoMembers = () => {
  const [{ hits, hasError, isLoading }, dispatch] = React.useReducer(reducer, {
    hits: [],
    isLoading: true,
    hasError: false,
  })
  const [query, setQuery] = React.useState("")

  React.useEffect(() => {
    const { cancel, token } = axios.CancelToken.source()
    const timeOutId = setTimeout(() => fetchHits(query, dispatch, token), 500)
    return () => cancel("No longer latest query") || clearTimeout(timeOutId)
  }, [query])

  React.useEffect(() => {
    console.log("EditDaoMembers.js - component mounted")

    return () => {
      setQuery("")
      console.log("EditDaoMembers.js - component unmounted")
    }
  }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

  // drag and drop stuff below
  const results = [
    { id: "1", name: "Draggable 1" },
    { id: "2", name: "Draggable 2" },
  ]

  const [members, setMembers] = React.useState([])
  const [addMembersState, setAddMembersState] = React.useState([])
  const [removeMembersState, setRemoveMembersState] = React.useState([])

  React.useEffect(() => {
    setMembers(results)
  }, [])

  const onDragEnd = result => {
    const { destination, source, draggableId } = result
    if (!destination) {
      return
    }
    if (destination.droppableId === "droppable-add") {
      const memberToAdd = results.find(member => member.id === draggableId)
      const newMembers = members.filter(member => member.id !== draggableId)
      setMembers(newMembers)
      setAddMembersState([...addMembersState, memberToAdd])
    }
    if (destination.droppableId === "droppable-remove") {
      const memberToRemove = results.find(member => member.id === draggableId)
      const newMembers = members.filter(member => member.id !== draggableId)
      setMembers(newMembers)
      setRemoveMembersState([...removeMembersState, memberToRemove])
    }
    console.log(result)
  }

  return (
    <div className="w-full">
      <div className="relative w-full border-b-2 border-slate-300 py-3 text-slate-600 focus-within:text-slate-400 dark:focus-within:text-slate-100">
        <span className="absolute left-0 top-4 flex items-center pl-2">
          <GoSearch size={24} />
        </span>
        <input
          autoFocus
          className="w-full bg-slate-200 py-2 pl-12 text-sm text-white focus:text-slate-900 focus:outline-none dark:bg-slate-900 dark:focus:text-slate-100"
          placeholder="Search..."
          autoComplete="off"
          // onChange={event => setQuery(event.target.value)}
          // value={query}
        />
      </div>
      {!query.length ? (
        <div className="flex flex-col space-y-2 py-3">
          <DragDropContext onDragEnd={onDragEnd}>
            {/* search results and dao members container */}
            <Droppable droppableId="droppable-results">
              {(provided, snapshot) => (
                <div
                  className="flex h-24 w-full flex-row items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {members.map((item, index) => (
                    <EditDaoMemberCard
                      id={item.id}
                      name={item.name}
                      index={index}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* add members container  */}
            <div className="flex w-full flex-row space-x-2">
              <Droppable droppableId="droppable-add">
                {(provided, snapshot) => (
                  <div
                    className="flex h-24 w-1/2 rounded-xl bg-slate-200 p-2 dark:bg-slate-800"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {addMembersState.map((item, index) => (
                      <EditDaoMemberCard
                        id={item.id}
                        name={item.name}
                        index={index}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* remove members container  */}
              <Droppable droppableId="droppable-remove">
                {(provided, snapshot) => (
                  <div
                    className="flex h-24 w-1/2 rounded-xl bg-slate-200 p-2 dark:bg-slate-800"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {removeMembersState.map((item, index) => (
                      <EditDaoMemberCard
                        id={item.id}
                        name={item.name}
                        index={index}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        </div>
      ) : null}
      <div className="mb-2 flex w-full flex-row items-center justify-between">
        <button className="focus:shadow-outline w-full rounded-xl border-2 bg-slate-300 py-3 px-4 font-bold shadow-xl hover:border-2 hover:border-[#0db2ac93] hover:bg-slate-100 hover:shadow-sm focus:outline-none dark:bg-slate-800">
          submit
        </button>
      </div>
    </div>
  )
}

export default EditDaoMembers

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

  ////////////////////////////////////////////////////////////////////////////////
  // drag and drop / add remove members from bbyDAO functionaility
  const results = [
    { id: "1", name: "Draggable 1" },
    { id: "2", name: "Draggable 2" },
    { id: "3", name: "Draggable 3" },
    { id: "4", name: "Draggable 4" },
    { id: "5", name: "Draggable 5" },
  ]

  // users that can be added to, or removed from the dao
  // (filtered from query results [hits], displayed in the results section of the modal, styled to indicate whether they can be added or removed)
  const [members, setMembers] = React.useState([...results])
  // users to add to the dao
  const [addMembersState, setAddMembersState] = React.useState([])
  // users to remove from the dao
  const [removeMembersState, setRemoveMembersState] = React.useState([])

  // TO DO:
  // load dao members into results on load, say they drag one member into the remove section
  // next, they perform a search, populate the results section with eligible members
  // we should make sure that the user that they already have in the remove section has no way of showing up in the search results
  // same behavior for add section as well.

  // disabling + ui indication when a user that is already a member of the dao is being dragged into the add section
  // same for if a user is not a part of a dao and is being dragged into the remove section

  const onDragEnd = result => {
    const { destination, source, draggableId } = result
    if (!destination || destination.droppableId === source.droppableId) {
      return
    }

    // dropping into add list
    if (destination.droppableId === "droppable-add") {
      if (source.droppableId === "droppable-results") {
        const newResults = results.filter(result => result.id !== draggableId)
        setMembers(newResults)
      }
      if (source.droppableId === "droppable-remove") {
        const newRemoveMembersState = removeMembersState.filter(
          member => member.id !== draggableId
        )
        setRemoveMembersState(newRemoveMembersState)
      }
      const memberToAdd = results.find(member => member.id === draggableId)
      const newMembers = members.filter(member => member.id !== draggableId)
      setMembers(newMembers)
      setAddMembersState([...addMembersState, memberToAdd])
    }
    // dropping into remove list
    if (destination.droppableId === "droppable-remove") {
      if (source.droppableId === "droppable-results") {
        const memberToRemove = results.find(member => member.id === draggableId)
        const newMembers = members.filter(member => member.id !== draggableId)
        setMembers(newMembers)
        setRemoveMembersState([...removeMembersState, memberToRemove])
      }
      if (source.droppableId === "droppable-add") {
        const newAddMembersState = addMembersState.filter(
          member => member.id !== draggableId
        )
        setAddMembersState(newAddMembersState)
      }
      const memberToRemove = results.find(member => member.id === draggableId)
      const newMembers = members.filter(member => member.id !== draggableId)
      setMembers(newMembers)
      setRemoveMembersState([...removeMembersState, memberToRemove])
    }
    // dropping into results list
    if (destination.droppableId === "droppable-results") {
      if (source.droppableId === "droppable-add") {
        const memberToAdd = addMembersState.find(
          member => member.id === draggableId
        )
        const newAddMembersState = addMembersState.filter(
          member => member.id !== draggableId
        )
        setAddMembersState(newAddMembersState)
        setMembers([...members, memberToAdd])
      }
      if (source.droppableId === "droppable-remove") {
        const memberToRemove = removeMembersState.find(
          member => member.id === draggableId
        )
        const newRemoveMembersState = removeMembersState.filter(
          member => member.id !== draggableId
        )
        setRemoveMembersState(newRemoveMembersState)
        setMembers([...members, memberToRemove])
      }
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    // assigns appropriate method to the member - add or remove
    const addMembers = addMembersState.map(member => ({
      ...member,
      method: "add",
    }))
    const removeMembers = removeMembersState.map(member => ({
      ...member,
      method: "remove",
    }))

    // pairs swaps into array as well as leftover members in another array
    const swap = []
    const leftover = []
    const maxLength = Math.max(addMembers.length, removeMembers.length)
    for (let i = 0; i < maxLength; i++) {
      const addMember = addMembers[i]
      const removeMember = removeMembers[i]
      if (addMember && removeMember) {
        swap.push({ addMember, removeMember })
      } else {
        leftover.push(addMember || removeMember)
      }
    }

    // log and label the arrays
    console.log("swap", swap)
    console.log("leftover", leftover)
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
                  className="flex h-32 w-full flex-row space-x-2 rounded-xl bg-slate-100 p-2 dark:bg-slate-800"
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

            <div className="flex h-24 w-full grow flex-row space-x-2">
              {/* add members container  */}
              <Droppable droppableId="droppable-add">
                {(provided, snapshot) => (
                  <div
                    className={
                      "grid h-auto w-1/2 grid-cols-1 gap-2 rounded-xl bg-slate-100 p-2 dark:bg-slate-800 md:grid-cols-2" +
                      (snapshot.isDraggingOver
                        ? " border border-teal-300 bg-slate-300 dark:bg-slate-700"
                        : "")
                    }
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {addMembersState.length ? (
                      addMembersState.map((item, index) => (
                        <EditDaoMemberCard
                          id={item.id}
                          name={item.name}
                          index={index}
                        />
                      ))
                    ) : (
                      <div className="flex h-24"></div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* remove members container  */}
              <Droppable droppableId="droppable-remove">
                {(provided, snapshot) => (
                  <div
                    className={
                      "grid h-auto w-1/2 grid-cols-1 gap-2 rounded-xl bg-slate-100 p-2 dark:bg-slate-800 md:grid-cols-2" +
                      (snapshot.isDraggingOver
                        ? " border border-red-300 bg-slate-300 dark:bg-slate-700"
                        : "")
                    }
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {removeMembersState.length ? (
                      removeMembersState.map((item, index) => (
                        <EditDaoMemberCard
                          id={item.id}
                          name={item.name}
                          index={index}
                        />
                      ))
                    ) : (
                      <div className="flex h-24"></div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        </div>
      ) : null}
      <div className="mb-2 flex w-full flex-row items-center justify-between">
        <button
          className="focus:shadow-outline w-full rounded-xl border-2 bg-slate-300 py-3 px-4 font-bold shadow-xl hover:border-2 hover:border-[#0db2ac93] hover:bg-slate-100 hover:shadow-sm focus:outline-none dark:bg-slate-800"
          onClick={handleSubmit}
        >
          submit
        </button>
      </div>
    </div>
  )
}

export default EditDaoMembers

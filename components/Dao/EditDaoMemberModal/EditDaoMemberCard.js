import React from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

const EditDaoMemberCard = ({ id, name, index }) => {
  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="h-min rounded-xl bg-slate-300 p-2 dark:bg-slate-900"
        >
          {name}
        </div>
      )}
    </Draggable>
  )
}

export default EditDaoMemberCard

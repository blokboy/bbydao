import React from "react"
import { HiQuestionMarkCircle } from "react-icons/hi"

const ToolTip = ({ message, children }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative inline-flex self-start">
      <div onMouseOver={() => setIsOpen(bool => !bool)} onMouseOut={() => setIsOpen(bool => !bool)}>
        <HiQuestionMarkCircle className="ml-2 hover:cursor-help" size={16} />
      </div>
        {isOpen && (
            <div
                onMouseOver={() => setIsOpen(true)}
                onMouseOut={() => setIsOpen(false)}
                className="absolute left-7 -top-8 z-50 w-44 rounded-xl shadow bg-slate-300 dark:bg-slate-600 text-sm font-thin"
            >
                <div className="p-4">{message || children}</div>
            </div>
        )}
    </div>
  )
}

export default ToolTip

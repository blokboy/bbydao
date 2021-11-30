import React from "react"
import { FiBell } from "react-icons/fi"

const NotificationsIcon = () => {
  const [count, setCount] = React.useState(8)

  return (
    <div className="hidden md:flex flex-row items-center justify-center mr-3">
      <button className="flex items-center justify-center h-10 w-10 p-1 rounded-full border border-gray-400 text-gray-800 bg-gray-200 hover:bg-gray-100 dark:text-white dark:bg-gray-900 dark:hover:bg-gray-700">
        <FiBell />
      </button>
      {count > 0 ? (
        <span
          className={
            "absolute -mt-8 -mr-8 bg-red-500 text-white text-xs rounded-full py-1" +
            (count > 10 ? " px-1" : " px-2")
          }
        >
          {count}
        </span>
      ) : (
        <></>
      )}
    </div>
  )
}

export default NotificationsIcon

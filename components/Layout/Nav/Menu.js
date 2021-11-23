import React from "react"
import { HiDotsHorizontal } from "react-icons/hi"
import ClickAwayListener from "react-click-away-listener"

const Menu = () => {
  const [menuOpen, setMenuOpen] = React.useState(false)

  const clickAway = () => {
    if (!menuOpen) {
      return
    }
    setMenuOpen(false)
  }

  return (
    <ClickAwayListener onClickAway={clickAway}>
      <div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-10 rounded-xl border border-gray-400 text-xl text-gray-800 bg-gray-200 hover:bg-gray-100 dark:text-white dark:bg-gray-900 dark:hover:bg-gray-700 px-3 py-2"
        >
          <HiDotsHorizontal />
        </button>
        <div
          className={
            (menuOpen ? "absolute " : "hidden ") +
            "text-gray-800 bg-gray-200 dark:text-white dark:bg-gray-900 z-50 rounded border shadow -ml-20 mt-4 px-4 py-2"
          }
        >
          <ul className="py-1">
            <li>
              <a
                href="#"
                className="flex flex-row text-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-2"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex flex-row text-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-2"
              >
                Activity
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex flex-row text-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-2"
              >
                Explore
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex flex-row text-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-2"
              >
                Feed
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex flex-row text-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-2"
              >
                About
              </a>
            </li>
          </ul>
        </div>
      </div>
    </ClickAwayListener>
  )
}

export default Menu

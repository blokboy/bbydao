import React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { HiDotsHorizontal } from "react-icons/hi"
import ClickAwayListener from "react-click-away-listener"
import { useAccountStore } from "../../../stores/useAccountStore"

const Menu = () => {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const userData = useAccountStore(state => state.userData)

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
            "z-50 rounded border shadow -ml-20 mt-4 px-4 py-2 text-gray-800 bg-gray-200 dark:text-white dark:bg-gray-900"
          }
        >
          <ul className="py-1" onClick={clickAway}>
            <li>
              <Link href={userData ? `/user/${userData.username}` : "/"}>
                <a className="flex flex-row text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-2">
                  Dashboard
                </a>
              </Link>
            </li>

            <li>
              <a
                href="#"
                className="md:hidden flex flex-row text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-2"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "light" ? <>Dark Mode</> : <>Light Mode</>}
              </a>
            </li>

            <li>
              <a
                href="#"
                className="flex flex-row text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-2"
              >
                Activity
              </a>
            </li>

            <li>
              <Link href={"/"}>
                <a className="flex flex-row text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-2">
                  Explore
                </a>
              </Link>
            </li>

            <li>
              <a
                href="#"
                className="flex flex-row text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-2"
              >
                Feed
              </a>
            </li>

            <li>
              <a
                href="#"
                className="flex flex-row text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-2"
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

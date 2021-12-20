import React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { BsMask } from "react-icons/bs"

const MenuThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <li className="w-full">
      <Link href={"/"}>
        <a
          className="md:hidden flex flex-row rounded hover:shadow text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-2 justify-between"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "light" ? <>Dark Mode</> : <>Light Mode</>}
          <span className="self-center">
            <BsMask />
          </span>
        </a>
      </Link>
    </li>
  )
}

export default MenuThemeToggle

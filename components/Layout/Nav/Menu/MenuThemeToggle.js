import React from "react"
import { useTheme } from "next-themes"
import { BsMask } from "react-icons/bs"

const MenuThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <li className="w-full">
      <div
        className="md:hidden flex flex-row rounded hover:shadow text-sm text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-1 py-2 justify-between"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "light" ? <>Dark Mode</> : <>Light Mode</>}
        <span className="self-center">
          <BsMask />
        </span>
      </div>
    </li>
  )
}

export default MenuThemeToggle

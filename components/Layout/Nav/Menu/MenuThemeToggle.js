import React from "react"
import { useTheme } from "next-themes"
import { BsMask } from "react-icons/bs"

const MenuThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <li className="w-full">
      <div
        className="flex flex-row justify-between rounded px-1 py-2 text-sm text-slate-800 hover:bg-slate-100 hover:shadow dark:text-white dark:hover:bg-slate-800 md:hidden"
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

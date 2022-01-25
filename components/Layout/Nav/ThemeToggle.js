import React from "react"
import { useTheme } from "next-themes"
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs"

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="mx-2 hidden flex-row items-center justify-center md:flex">
      <button
        className="flex h-10 w-10 justify-center rounded-full bg-white p-2 shadow dark:bg-slate-900"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "light" ? (
          <BsFillMoonStarsFill
            className="text-indigo-800 hover:text-indigo-500"
            size={24}
          />
        ) : (
          <BsFillSunFill
            className="text-yellow-200 hover:text-yellow-100"
            size={24}
          />
        )}
      </button>
    </div>
  )
}

export default ThemeToggle

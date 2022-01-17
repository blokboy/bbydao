import React from "react"
import { useTheme } from "next-themes"
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs"

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="hidden md:flex flex-row items-center justify-center mx-2">
      <button
        className="flex rounded-full shadow p-2 bg-white dark:bg-slate-900 justify-center h-10 w-10"
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

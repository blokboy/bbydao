import React from "react"
import { useTheme } from "next-themes"
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs"

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-row items-center justify-center">
      {/* lightmode darkmode toggle & babydao icon - both views */}
      <button
        className="flex items-center justify-center h-10 w-10 ml-2 p-2 rounded-full bg-white dark:bg-gray-900"
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
      {/* <div className="hidden md:flex self-center ml-4">
            <Image
              src={`/../public/babydao.png`}
              alt="babydao logo"
              width={38}
              height={38}
            />
          </div> */}
    </div>
  )
}

export default ThemeToggle

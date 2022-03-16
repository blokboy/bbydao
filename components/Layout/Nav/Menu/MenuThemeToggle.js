import React from "react"
import { useTheme } from "next-themes"
import { BsMask } from "react-icons/bs"

const MenuThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <li>
      <button
        type="button"
        className="menu-link cursor-pointer font-bold w-full flex justify-start"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <span className="mr-4 self-center">
          <BsMask />
        </span>
        {theme === "light" ? <>Dark Mode</> : <>Light Mode</>}
      </button>
    </li>
  )
}

export default MenuThemeToggle

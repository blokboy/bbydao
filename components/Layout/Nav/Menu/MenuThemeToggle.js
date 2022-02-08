import React from "react"
import { useTheme } from "next-themes"
import { BsMask } from "react-icons/bs"

const MenuThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <li className="w-full">
      <div
        className="menu-link"
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

import React from "react"
import { useTheme } from "next-themes"
import NavDropDown from "./NavDropDown"
import LoginModal from "./LoginModal"
import Image from "next/image"
import { GiHamburgerMenu } from "react-icons/gi"
import { MdClose } from "react-icons/md"
import { GoSearch } from "react-icons/go"
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs"

const Nav = ({ children }) => {
  const { theme, setTheme } = useTheme()
  const [navDropDownToggle, setNavDropDownToggle] = React.useState(false)
  const [loginModal, setLoginModal] = React.useState(false)

  return (
    <>
      <nav className="flex w-screen py-6 px-8">
        <div className="flex flex-row w-screen justify-between items-center">
          {/* mobile & small view */}
          <div className="block md:hidden text-2xl font-extrabold">babydao</div>
          {/* desktop & large view */}
          <div className="hidden md:relative md:block w-1/3 text-gray-600 focus-within:text-gray-400 dark:focus-within:text-gray-100">
            <span className="absolute left-0 top-1.5 flex items-center pl-2">
              <GoSearch size={24} />
            </span>
            <input
              type="search"
              className="w-full py-2 text-sm text-white bg-gray-200 rounded-full pl-10 focus:outline-none focus:bg-white focus:text-gray-900 dark:bg-gray-900 dark:focus:text-gray-100"
              placeholder="Search..."
              autoComplete="off"
            >
              {children}
            </input>
          </div>

          {/* mobile & small view */}
          <div className="flex flex-row md:hidden">
            <button className="flex items-center justify-center h-10 w-10 mx-1 rounded-full bg-white text-gray-800 hover:text-gray-500 dark:bg-gray-900 dark:text-gray-100">
              <GoSearch size={24} />
            </button>
            <button
              className="flex items-center justify-center h-10 w-10 mx-1 rounded-full bg-white text-gray-800 hover:text-gray-500 dark:bg-gray-900 dark:text-gray-100"
              onClick={() => setNavDropDownToggle(!navDropDownToggle)}
            >
              {navDropDownToggle ? (
                <MdClose className="dark:text-gray-100" size={24} />
              ) : (
                <GiHamburgerMenu className="dark:text-gray-100" size={24} />
              )}
            </button>
          </div>
          {/* desktop & large view */}
        </div>

        {/* LOGIN BUTTON */}
        <div className="flex flex-row items-center justify-center">
          <button
            className="w-max px-10 py-2 justify-center rounded-full bg-gray-200 hover:bg-white dark:bg-gray-900 dark:hover:bg-gray-700 dark:text-gray-100"
            onClick={() => setLoginModal(!loginModal)}
          >
            log in
          </button>

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
      </nav>
      {navDropDownToggle ? <NavDropDown /> : <></>}
      {loginModal ? <LoginModal /> : <></>}
    </>
  )
}

export default Nav

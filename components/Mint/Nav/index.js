import Link from "next/link"
import ThemeToggle from "./ThemeToggle"

const Nav = () => {
    return (
        <nav className="z-50 flex h-16 w-full items-center justify-between bg-white p-3 dark:bg-slate-900">
            <div className="flex md:w-full">
                <a className="mr-3 flex w-10 transform transition duration-500 ease-in-out hover:-translate-y-0.5 md:w-auto">
                    <img src="/baby_logo_original_gradient.png" alt="bbydaooriginal" height={60} width={180} />
                </a>
            </div>
            <div className="flex mr-2">
            </div>
        <ThemeToggle />
        </nav>
    )
}

export default Nav
import Link from "next/link"
import ThemeToggle from "./ThemeToggle"

const Nav = () => {
    return (
        <nav className="absolute z-50 flex h-16 w-full top-0 items-center justify-between p-3 ">
            <div className="flex md:w-full">
                <a className="mr-3 flex w-10 transform transition duration-500 ease-in-out hover:-translate-y-0.5 md:w-auto">
                    <img src="/mint/baby_logo_original_gradient.png" alt="bbydaooriginal" height={60} width={180} />
                </a>
            </div>
            <div className="flex mr-2">
                <div className="flex-1">Twitter</div>
                <div className="flex-1">Website</div>
                <div className="flex-1">FAQ</div>
            </div>
        

        <ThemeToggle />
        </nav>
    )
}

export default Nav
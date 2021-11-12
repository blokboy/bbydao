import Link from "next/link"

const NavDropDown = () => {
  return (
    <div className="md:hidden flex flex-col items-center justify-center	min-h-full">
      <ul className="flex-col p-4">
        <li className="cursor-pointer mb-6 text-5xl font-extrabold hover:text-gray-500">
          <Link href="/">
            <a>activity</a>
          </Link>
        </li>
        <li className="cursor-pointer mb-6 text-5xl font-extrabold hover:text-gray-500">
          <Link href="/">
            <a>explore</a>
          </Link>
        </li>
        <li className="cursor-pointer mb-6 text-5xl font-extrabold hover:text-gray-500">
          <Link href="/">
            <a>feed</a>
          </Link>
        </li>
        <li className="cursor-pointer mb-6 text-5xl font-extrabold hover:text-gray-500">
          <Link href="/">
            <a>how it works</a>
          </Link>
        </li>
        <li className="cursor-pointer mb-6 text-5xl font-extrabold hover:text-gray-500">
          <Link href="/">
            <a>about us</a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default NavDropDown

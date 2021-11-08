import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image';
import { BiMessageAlt, BiMessageAltError} from 'react-icons/bi';
import { IoIosNotificationsOutline, IoIosSettings } from 'react-icons/io';

const Nav = ({ children }) => {
    const router = useRouter()
    if (router.pathname === '/') return <></>
    
    return (
        // Nav is not yet responsive
        <nav className="flex w-full p-3 pl-6 pr-6">

            <div className="relative w-1/3 mt-2 mb-2 text-gray-600 focus-within:text-gray-400">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </span>
                <input type="search" className="w-full py-2 text-sm text-white bg-gray-300 rounded-full pl-10 focus:outline-none focus:bg-white focus:text-gray-900" placeholder="Search..." autoComplete="off">
                    {children}
                </input>
            </div>

            <div className="flex flex-row w-2/3 justify-end place-items-center">
                <ul className="flex flex-row space-x-8">
                <li className="cursor-pointer">
                    <Link href='/'><a>activity</a></Link>
                </li>
                <li className="cursor-pointer">
                    <Link href='/'><a>explore</a></Link>
                </li>
                <li className="cursor-pointer">
                    <Link href='/'><a>feed</a></Link>
                </li>
                <li className="cursor-pointer">
                    <Link href='/'><a>how it works</a></Link>
                </li>
                <li className="cursor-pointer">
                    <Link href='/'><a>about us</a></Link>
                </li>
                <li className="cursor-pointer">
                    <BiMessageAlt size={36}/>
                </li>
                <li className="cursor-pointer">
                    <IoIosNotificationsOutline size={36}/>
                </li>
                <li className="cursor-pointer">
                    <Image src={`/../public/babydao.png`} alt="babydao logo" width={32} height={32} />
                </li>
                </ul>
            </div>    
        </nav>  
    )
}

export default Nav
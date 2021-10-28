import { BiMessageAlt, BiMessageAltError} from 'react-icons/bi';
import { IoIosNotificationsOutline, IoIosSettings } from 'react-icons/io';
import Image from 'next/image';

export default function Navbar({ children }) {
    return (
        <div className="w-11/12 mx-auto flex space-around items-center">
            
            <input className="p-3 mx-auto bg-white w-1/3 rounded-xl m-2 shadow-md border border-black text-center">
                { children }
            </input>
            <div className="flex justify-between w-48">
                <div className="cursor-pointer">
                    <BiMessageAlt size={36}/>
                </div>
                <div className="cursor-pointer">
                    <IoIosNotificationsOutline size={36}/>
                </div>
                <div className="cursor-pointer">
                    <Image src={`/../public/babydao.png`} width={32} height={32} />
                </div>
            </div>    
        </div>  
    )
}
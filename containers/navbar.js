import { BiMessageAlt, BiMessageAltError} from 'react-icons/bi';
import { IoIosNotificationsOutline, IoIosSettings } from 'react-icons/io';

export default function Navbar({ children }) {
    return (
        <div className="w-11/12 mx-auto flex items-center">
            <input className="p-3 mx-auto bg-white w-1/3 rounded-xl m-2 shadow-md border border-black">
                { children }
            </input>
            <div className="flex justify-around w-48">
                <div>
                    <BiMessageAlt size={32}/>
                </div>
                <div>
                    <IoIosNotificationsOutline size={32}/>
                </div>
                <div>
                    <IoIosSettings size={32}/>
                </div>
            </div>    
        </div>  
    )
}
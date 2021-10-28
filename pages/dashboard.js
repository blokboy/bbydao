import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Navbar from '../containers/navbar';
import Profile from '../containers/profile';
import Daos from '../containers/daos';

export default function Dashboard() {
    return(
        
        <div>
            <Navbar />
            
            <div className="border border-black w-full h-3/4 flex flex-col ">
                <Profile />
                <Profile />
            </div>
            
        </div>
    );
}
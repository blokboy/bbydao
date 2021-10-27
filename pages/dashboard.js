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
            <hr />
            <div>
                <Profile />
                <Profile />
            </div>
            <div className="float-right">
                <Daos />
            </div>  
        </div>
    );
}
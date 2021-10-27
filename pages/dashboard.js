import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Navbar from '../containers/navbar';

export default function Dashboard() {
    return(
        
        <div>
            <Navbar />
            <h1>Dashboard!</h1>
        </div>
    );
}
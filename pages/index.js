import Head from 'next/head'
import { RainbowButton } from '@rainbow-me/rainbow-button';
import { useState, useEffect, useCallback } from 'react';
import Router from 'next/router';

export default function Landing() {
  const [connector, setConnector] = useState({});

  const onConnectorInitialized = useCallback(
    (connector) => {
      console.log(connector);
      setConnector(connector);
      Router.push('/dashboard');
    },
    [setConnector]
  );
  // Subscribe to connection events and update your app accordingly 
  const subscribeToEvents = useCallback(() => {
    connector.on('connect', (error, payload) => {
      if (error) {
        throw error;
      }
      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
    });
    connector.on('session_update', (error, payload) => {
      if (error) {
        throw error;
      }
      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];
    });
    connector.on('disconnect', (error, payload) => {
      if (error) {
        throw error;
      }
      // Delete connector
      setConnector(null);
    });
  }, [connector]);

  useEffect(() => {
      subscribeToEvents
  }, []);
  
  return (
    <>
      <Head>
        <title>babydao</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='flex flex-col items-center justify-center min-h-screen'>
        <h1 className='text-3xl sm:text-5xl mb-3'>Welcome to babydao</h1>
        <p className='mb-3'>Get started by connecting your wallet{' '}</p>    
        <RainbowButton
          chainId={1}
          connectorOptions={{ bridge: 'https://bridge.walletconnect.org' }}
          onConnectorInitialized={() => onConnectorInitialized}
        />
      </main>
    </>
  )
}

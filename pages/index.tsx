import Center from '../components/Center'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import { getSession, GetSessionParams } from 'next-auth/react'
import Player from '../components/Player'

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Sepotipai (A Spotify Clone)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='flex'>
        {/* Sidebar */}
        <Sidebar />
        {/* Center */}
        <Center />
      </main>

      <div className='sticky bottom-0'>
        {/* Player */}
        <Player />
      </div>
    </div>
  )
}

export async function getServerSideProps(ctx: GetSessionParams){
  const session = await getSession(ctx);

  return{
    props: {
      session
    }
  }
}

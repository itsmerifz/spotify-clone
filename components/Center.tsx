//@ts-nocheck
import { ChevronDownIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';

const colors = [
  "from-indigo-500",
  "from-red-500",
  "from-orange-500",
  "from-blue-500",
  "from-green-500",
  "from-purple-500",
  "from-pink-500",
  "from-teal-500",
  "from-yellow-500",
]

const Center = () => {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [warna, setWarna] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  
  useEffect(() => {
    setWarna(shuffle(colors).pop())  
  }, [playlistId]);

  useEffect(() => {
    spotifyApi.getPlaylist(playlistId).then(data => {
      setPlaylist(data.body)
    }).catch(err => {
      console.log("Ada kesalahan",err)
    })
  },[spotifyApi, playlistId])
  
  

  return (
    <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide'>
      <header className='absolute top-5 right-8'>
        <div className='flex items-center bg-black space-x-3 opacity-90 text-white hover:opacity-80 cursor-pointer rounded-full p-1 pr-2'>
          <img src={session?.user?.image} alt="" className='rounded-full w-10 h-10' />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className='h-5 w-5' />
        </div>
      </header>

      <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${warna} h-80 text-white p-8`}>
        <img className='h-44 w-44 shadow-2xl' src={playlist?.images?.[0]?.url} alt="" />
        <div>
          <p>PLAYLIST</p>
          <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>{playlist?.name}</h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  )
}

export default Center;

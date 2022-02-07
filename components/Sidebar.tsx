//@ts-nocheck
import { HomeIcon, SearchIcon, LibraryIcon, PlusCircleIcon, RssIcon, HeartIcon, LogoutIcon } from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import useSpotify from '../hooks/useSpotify';
import { playlistIdState } from '../atoms/playlistAtom';


const Sidebar = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlist, setPlaylist] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    if(spotifyApi.getAccessToken()){
      spotifyApi.getUserPlaylists().then(res => {
        setPlaylist(res.body.items);
      })
    }
  },[session, spotifyApi])
  


  return (
    <div className='text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36'>
      <div className='space-y-4'>
        <button className='flex items-center space-x-2 hover:text-white' onClick={() => signOut()}>
          <LogoutIcon className='h-5 w-5' />
          <p>Keluar</p>
        </button>
        <hr className='border-t-[0.1px] border-gray-900' />

        <button className='flex items-center space-x-2 hover:text-white'>
          <HomeIcon className='h-5 w-5' />
          <p>Beranda</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <SearchIcon className='h-5 w-5' />
          <p>Cari</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <LibraryIcon className='h-5 w-5' />
          <p>Koleksi Kamu</p>
        </button>
        <hr className='border-t-[0.1px] border-gray-900' />

        <button className='flex items-center space-x-2 hover:text-white'>
          <PlusCircleIcon className='h-5 w-5' />
          <p>Buat Playlist</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <HeartIcon className='h-5 w-5' />
          <p>Lagu yang Disukai</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <RssIcon className='h-5 w-5' />
          <p>Episode Kamu</p>
        </button>
        <hr className='border-t-[0.1px] border-gray-900' />

        {/* Playlist */}
        {
          playlist.map(item => (
            <p key={item.id} onClick={() => setPlaylistId(item.id)} className='cursor-pointer hover:text-white'>{item.name}</p>
          ))
        }
        <div className='pt-[75px]'>
          &nbsp;
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

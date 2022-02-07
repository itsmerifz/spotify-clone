//@ts-nocheck
import { currentTrackIdState, isPlayingState, isRepeatState } from 'atoms/songAtom';
import useSpotify from 'hooks/useSpotify';
import useSongInfo from 'hooks/useSongInfo';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { HeartIcon, VolumeUpIcon as VolOutline } from '@heroicons/react/outline';
import { RewindIcon, FastForwardIcon, PauseIcon, PlayIcon, SwitchHorizontalIcon, ReplyIcon, VolumeUpIcon as VolSolid, RefreshIcon } from '@heroicons/react/solid';
import { debounce } from 'lodash';
import Slider from '@mui/material/Slider';

const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [isRepeat, setIsRepeat] = useRecoilState(isRepeatState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();

  const getSongInfo = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then(data => {
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then(data => {
          setIsPlaying(data.body?.is_playing);
          console.log('Sedang memutar :', data.body?.item?.name);
        });
      });
    }
  }

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then(data => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    }
    )
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // ambil data lagu dari spotify
      getSongInfo();
      setVolume(50);
    }

  }, [currentTrackIdState, spotifyApi, session])

  useEffect(() => {
    if (volume > 10 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume])

  const debouncedAdjustVolume = useCallback(
    debounce(volume => {
      spotifyApi.setVolume(volume).catch(err => { });
    }, 100), []
  )

  const handleRepeat = () => {
    spotifyApi.getMyCurrentPlaybackState().then(data => {
      if (data.body.repeat_state === 'off' ) {
        spotifyApi.setRepeat('context');
        setIsRepeat('context');
      } else {
        spotifyApi.setRepeat('off');
        setIsRepeat('off');
      }
    }).catch(err => { });
  }

  useEffect(() => {
    if(spotifyApi.getAccessToken() && !currentTrackId){
      spotifyApi.getMyCurrentPlaybackState().then(data => {
        setIsRepeat(data.body.repeat_state);
      }).catch(err => { });
    }
  }, [isRepeatState])

  return (
    <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
      {/* Bagian Kiri */}
      <div className='flex items-center space-x-4'>
        <img className='h-10 w-10 hidden md:inline' src={songInfo?.album.images?.[0]?.url} alt="" />
        <div>
          <h3 className='w-28 lg:w-36 truncate font-semibold'>{songInfo?.name}</h3>
          <p className='text-gray-500 text-sm'>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Bagian Tengah */}
      <div className='flex items-center justify-evenly'>
        <SwitchHorizontalIcon className='button' />
        <RewindIcon className='button' onClick={() => {
          spotifyApi.skipToPrevious();
          getSongInfo();
        }
        }
        />
        {
          isPlaying ? (
            <PauseIcon className='button w-10 h-10' onClick={handlePlayPause} />
          ) : (
            <PlayIcon className='button w-10 h-10' onClick={handlePlayPause} />
          )
        }
        <FastForwardIcon className='button' onClick={() => {
          spotifyApi.skipToNext()
          getSongInfo();
        }
        }
        />
        <div className='flex flex-col justify-center items-center'>
          <RefreshIcon className='button' onClick={handleRepeat} />
          {
            isRepeat === 'context' ? (
              <span className='items-baseline absolute bottom-5'>&#8226;</span>
            ) : null
          }
        </div>
      </div>

      {/* Bagian Kanan */}
      <div className='flex items-center space-x-3 md:space-x-4 justify-end p-5'>
        <VolOutline className='button' onClick={() => volume > 0 && setVolume(volume - 10)} />
        <Slider valueLabelDisplay='auto' sx={{
          color: '#fff', 
          '& .MuiSlider-thumb': {
            opacity: '0',
          },
          '& .MuiSlider-thumb:hover': {
            opacity: '1',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#fff',
          },
          '& .MuiSlider-track': {
            color: '#18d860'
          }
        }} className='w-14 md:w-28' value={volume} min={0} max={100} onChange={e => setVolume(Number(e.target.value))} />
        <VolSolid className='button' onClick={() => volume < 100 && setVolume(volume + 10)} />
      </div>
    </div>
  )
}

export default Player;

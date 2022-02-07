//@ts-nocheck
import { currentTrackIdState, isPlayingState, isRepeatState } from 'atoms/songAtom';
import useSpotify from 'hooks/useSpotify';
import useSongInfo from 'hooks/useSongInfo';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { VolumeUpIcon as VolOutline } from '@heroicons/react/outline';
import { RewindIcon, FastForwardIcon, PauseIcon, PlayIcon, SwitchHorizontalIcon, VolumeUpIcon as VolSolid, RefreshIcon } from '@heroicons/react/solid';
import { debounce } from 'lodash';
import Slider from '@mui/material/Slider';
import { millisToMinutesAndSecond } from '../lib/time';

const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [isRepeat, setIsRepeat] = useRecoilState(isRepeatState);
  const [volume, setVolume] = useState(null);
  const [progressSong, setProgressSong] = useState(0)
  const [durationSong, setDurationSong] = useState(0)
  const [progressSongMs, setProgressSongMs] = useState(0)
  const [durationSongMs, setDurationSongMs] = useState(0)
  const songInfo = useSongInfo();

  const getSongInfo = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then(data => {
        setCurrentTrackId(data.body?.item?.id);
        setProgressSong(millisToMinutesAndSecond(data.body.progress_ms));
        setDurationSong(millisToMinutesAndSecond(data.body.item.duration_ms));
        setProgressSongMs(data.body.progress_ms);
        setDurationSongMs(data.body.item.duration_ms);
        spotifyApi.getMyCurrentPlaybackState().then(data => {
          setIsPlaying(data.body?.is_playing);
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
    ).catch(err => { alert('Perangkat Spotify tidak terdeteksi atau Akun anda bukan akun premium, Silahkan refresh.') });
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // ambil data lagu dari spotify
      getSongInfo();
      spotifyApi.getMyCurrentPlaybackState().then(data => {
        setVolume(data.body.device.volume_percent);
      });
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

  const handleSeek = (e) => {
    setProgressSongMs(e);
    spotifyApi.seek(e).then(data =>{
    }).catch(err => { });
  }

  const handleRepeat = () => {
    spotifyApi.getMyCurrentPlaybackState().then(data => {
      if (data.body.repeat_state === 'off') {
        spotifyApi.setRepeat('context');
        setIsRepeat('context');
      } else {
        spotifyApi.setRepeat('off');
        setIsRepeat('off');
      }
    }).catch(err => { alert('Perangkat Spotify tidak terdeteksi atau Akun anda bukan akun premium, Silahkan refresh.') });
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      spotifyApi.getMyCurrentPlaybackState().then(data => {
        setIsRepeat(data.body.repeat_state);
      }).catch(err => { alert('Perangkat Spotify tidak terdeteksi atau Akun anda bukan akun premium, Silahkan refresh.') });
    }
  }, [isRepeatState])

  const handlePrev = () => {
    spotifyApi.skipToPrevious();
  }

  const handleNext = () => {
    spotifyApi.skipToNext();
  }

  useEffect(() => {
    setInterval(() => {
      if (spotifyApi.getAccessToken() && !currentTrackId) {
        getSongInfo();
      }
    }, 500);
  }, [currentTrackIdState, spotifyApi])

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
      <div className=''>
        <div className='flex items-center justify-evenly mt-5'>
          <SwitchHorizontalIcon className='button' />
          <RewindIcon className='button' onClick={handlePrev}
          />
          {
            isPlaying ? (
              <PauseIcon className='button w-10 h-10' onClick={handlePlayPause} />
            ) : (
              <PlayIcon className='button w-10 h-10' onClick={handlePlayPause} />
            )
          }
          <FastForwardIcon className='button' onClick={handleNext}
          />
          <div className='flex flex-col justify-center items-center'>
            <RefreshIcon className='button' onClick={handleRepeat} />
            {
              isRepeat === 'context' ? (
                <span className='items-baseline absolute bottom-6'>&#8226;</span>
              ) : null
            }
          </div>
        </div>
        <div className='flex space-x-4 justify-evenly text-white items-center'>
          <p className='text-gray-500 text-xs md:text-sm'>{progressSong}</p>
          <Slider
            value={progressSongMs}
            min={0}
            max={durationSongMs}
            valueLabelDisplay='off'
            onChange={e => {handleSeek(Number(e.target.value))}}
            sx={{
              color:'#fff',
              '& .MuiSlider-track': {
                color: '#18d860'
              },
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
            }}
          />
          <p className='text-gray-500 text-xs md:text-sm'>{durationSong}</p>
        </div>
      </div>

      {/* Bagian Kanan */}
      <div className='flex items-center space-x-3 md:space-x-4 justify-end p-5'>
        <VolOutline className='button' onClick={() => volume > 0 && setVolume(volume - 10)} />
        <div className='w-16 md:w-28 items-center justify-center'>
          <Slider valueLabelDisplay='auto' sx={{
            color: '#fff',
            marginTop: '5px',
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
          }} value={volume} min={0} max={100} onChange={e => setVolume(Number(e.target.value))} />
        </div>
        <VolSolid className='button' onClick={() => volume < 100 && setVolume(volume + 10)} />
      </div>
    </div>
  )
}

export default Player;

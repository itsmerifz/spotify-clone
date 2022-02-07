import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState } from '../atoms/songAtom'
import useSpotify from './useSpotify';

const useSongInfo = () => {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const getSongInfo = async () => {
      if(currentTrackId){
        const track = await fetch(`https://api.spotify.com/v1/tracks/${currentTrackId}`,{
          headers: {
            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
          },
        }).then(
          res => res.json()
        );
        setSongInfo(track);
      }
    }
    getSongInfo();
    }, [currentTrackId, spotifyApi]);
  
  return songInfo;
}

export default useSongInfo;

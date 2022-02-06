//@ts-nocheck
import { playlistState } from 'atoms/playlistAtom';
import { useRecoilValue } from 'recoil';
import Song from './Song';

const Songs = () => {
  const playlist = useRecoilValue(playlistState)
  
  return (
      <div className='text-white px-8 flex flex-col space-y-1 pb-28'>
        {
          playlist?.tracks.items.map((data, i) => {
            return (
              <Song key={data.track.id} track={data} order={i} />
            )
          })
        }
      </div>
  )
}

export default Songs;

import React from 'react'
import usePresence, { isOnline } from '@/hooks/usePresence';

const PlayersPane = ({user}: {user: any}) => {
  const location = 'lobby';
  const { id, username } = user;
  
  const [data, others, updatePresence] = usePresence(
    location,
    'User' + id,
    {
      text: '',
      username: username || '',
      x: 0,
      y: 0,
      typing: false as boolean,
    }
  );
  return (
    <div>
      {others?.filter(isOnline).map(presence => {
            if (!isOnline(presence)) return null;
            return (
              <div key={presence.created}>
                {presence.data.username}
              </div>
            )
          })}
    </div>
  )
}

export default PlayersPane
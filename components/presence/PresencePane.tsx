'use client'
import { useState } from 'react';
import usePresence, { isOnline } from '@/hooks/usePresence';
import useTypingIndicator from '@/hooks/useTypingIndicator';
import Facepile from './Facepile';

const Emojis =
  '😀 😃 😄 😁 😆 😅 😂 🤣 🥲 🥹 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 😎 🥸 🤩 🥳 😏 😳 🤔 🫢 🤭 🤫 😶 🫠 😮 🤤 😵‍💫 🥴 🤑 🤠'.split(
    ' '
  );

const PresencePane = ({userId, username}: {userId: string | undefined, username: string}) => {

  const [location, setLocation] = useState('RoomA');
  const [data, others, updatePresence] = usePresence(
    location,
    'User' + userId,
    {
      text: '',
      username,
      emoji: Emojis[23 % Emojis.length],
      x: 0,
      y: 0,
      typing: false as boolean,
    }
  );
  useTypingIndicator(data.text, updatePresence);
  const presentOthers = (others ?? []).filter(isOnline);
  return (
    <div className="flex flex-grow flex-col items-center">
      <select
        value={location}
        className="text-xl text-black"
        onChange={(e) => setLocation(e.target.value)}
      >
        <option key="A"> RoomA </option>
        <option key="B"> RoomB </option>
        <option key="C"> RoomC </option>
      </select>

      <h2>Facepile:</h2>
      <div className="flex p4 border-b border-solid flex-row justify-end">
        <Facepile othersPresence={others} />
        <select
          className="mx-2 text-xl"
          defaultValue={data.emoji}
          onChange={(e) => updatePresence({ emoji: e.target.value })}
        >
          {Emojis.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
      </div>
      <h2 className="mt-1">Shared cursors:</h2>

      <h2>Shared text:</h2>
      <div className="w-1/2">
        <span>
          {data.emoji + ': '}
          <input
            className="inline-block border rounded-md text-black"
            type="text"
            placeholder="type something!"
            name="name"
            value={data.text}
            onChange={(e) => updatePresence({ text: e.target.value })}
          />
        </span>
        <ul className="flex flex-col justify-start">
          {presentOthers
            .filter((p) => p.data.text)
            .sort((p1, p2) => p2.created - p1.created)
            .map((p) => (
              <li key={p.created}>
                <p>
                  {p.data.emoji +
                    ': ' +
                    p.data.text +
                    (p.data.typing ? '...' : '')}
                </p>
              </li>
            ))}
        </ul>
      </div>
      <div className="h-48"></div>
    </div>
  );
};

export default PresencePane;
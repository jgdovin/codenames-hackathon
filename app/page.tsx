'use client';

import { useRef, useState, useEffect } from 'react';

const Page = () => {
  const ref = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const nickname = localStorage.getItem('nickname');
    const userId = localStorage.getItem('userId');
    if (nickname) {
      setNickname(nickname);
    }
    if (!userId) {
      const userId =
        Math.random().toString(36).substring(2, 10) +
        '-' +
        Math.random().toString(36).substring(2, 10);
      localStorage.setItem('userId', userId);
    }
  }, []);

  const updateNickname = () => {
    // @ts-ignore
    const newNickname = ref?.current?.value.substring(0, 15);
    if (!newNickname) return;
    localStorage.setItem('nickname', newNickname);
    setNickname(newNickname);
    setIsEditing(false);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      updateNickname();
    }
  };

  return (
    <div>
      <div className='flex h-screen w-screen flex-col items-center justify-center gap-4'>
        <div className='flex h-36 w-96 flex-col items-center justify-center gap-6 rounded-xl bg-slate-700'>
          {isEditing || !nickname ? (
            <div>
              <input
                type='text'
                onKeyDown={handleKeyDown}
                placeholder='set your nickname'
                defaultValue={nickname}
                className='text-black'
                ref={ref}
              />{' '}
              <button onClick={() => updateNickname()}>Set Nickname</button>
            </div>
          ) : (
            <div>
              <span className='mr-4'>{nickname}</span>{' '}
              <button onClick={() => setIsEditing(true)}>Edit</button>
            </div>
          )}
          {nickname && !isEditing && (
            <div className='text-white'>
              <button
                className='rounded bg-blue-500 px-4 py-2 font-bold text-slate-100 hover:bg-blue-700'
                onClick={() => (window.location.href = '/game/main')}
              >
                Join Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;

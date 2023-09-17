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
      <div className='w-screen h-screen flex flex-col gap-4 items-center justify-center'>
        <div className='bg-slate-700 w-96 h-36 rounded-xl flex flex-col justify-center items-center gap-6'>
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
                className='bg-blue-500 hover:bg-blue-700 text-slate-100 font-bold py-2 px-4 rounded'
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

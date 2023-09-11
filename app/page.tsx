'use client'

import { useRef, useState, useEffect } from "react"

const Page = () => {
  const ref = useRef(null)
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const nickname = localStorage.getItem('nickname')
    if (nickname) {
      setNickname(nickname)
    }
  }, [])

  const updateNickname = () => {
    // @ts-ignore
    const newNickname = ref?.current?.value
    localStorage.setItem('nickname', newNickname)
    setNickname(newNickname)
    setIsEditing(false);
  }

  return (
    <div>
    <div className='w-screen h-screen flex flex-col gap-4 items-center justify-center'>
        <div className='bg-slate-700 w-96 h-36 rounded-xl flex flex-col justify-center items-center gap-6'>
            { isEditing || !nickname ? <div><input type="text" placeholder='set your nickname' defaultValue={nickname} className='text-black' ref={ref} /> <button onClick={() => updateNickname()}>Send</button></div> : 
            <div><span className='mr-4'>{nickname}</span> <button onClick={() => setIsEditing(true)}>Edit</button></div> }
            { nickname ? <div className='text-white'><button className='bg-blue-500 hover:bg-blue-700 text-slate-100 font-bold py-2 px-4 rounded' onClick={() => window.location.href = '/game/main'}>Start New Game</button></div> : null }
        </div>
      </div>
    </div>
  )
}

export default Page
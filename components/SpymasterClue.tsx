import { sendAction } from "@/lib/state/gameMachineUtil";
import { activeTeamColor, playerIsActiveSpymaster } from "@/lib/user";
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const SpymasterClue = ({
  state,
  room,
  userId,
}: {
  state: any;
  room: string;
  userId: string;
}) => {
  const [clue, setClue] = useState('');
  const [clueCount, setClueCount] = useState('0');
  const [isOpen, setIsOpen] = useState(false);

  const activeColor = activeTeamColor(state);
  
  const clueCountOptions = Array.from({length: 10}, (_, i) => i).map((count) => {
    return <li onClick={() => { setIsOpen(false); setClueCount(`${count}`)}} className='cursor-pointer border p-1 px-2 h-7 w-7 text-sm bg-slate-700 text-primary-foreground'>{count}</li>
  })

  return (
    <>
      {playerIsActiveSpymaster(state, userId) ? (
        <>
          <input
            type="text"
            className="bg-gray-200 appearance-none text-xs border-2 border-gray-200 rounded w-96 py-2 px-4 text-slate-700 leading-tight focus:outline-none focus:bg-white"
            onChange={(e) => setClue(e.target.value)}
          />
          <button
            onClick={() => {
              if (!clue) return;
              sendAction({ action: "give.clue", room, payload: JSON.stringify({clue, clueCount}) });
            }}
          >
            Give Clue
          </button>
          <Popover open={isOpen} onOpenChange={(open) => {setIsOpen(open)}}>
            <PopoverTrigger><div className=' border p-1 h-8 w-8 rounded-lg border-slate-300'>{clueCount}</div></PopoverTrigger>
            <PopoverContent className='bg-slate-500 w-96 h-16'>
                <ul className='flex gap-1.5'>
                  {clueCountOptions}
                  <li onClick={() => {setIsOpen(false); setClueCount('ꝏ')}} className='cursor-pointer border p-1 px-2 h-7 w-7 text-sm bg-slate-700 text-primary-foreground'>ꝏ</li>
                </ul>
              </PopoverContent>
          </Popover>

        </>
      ) : (
        <div>{activeColor} Team Spymaster is giving their clue.</div>
      )}
    </>
  );
};

export default SpymasterClue;

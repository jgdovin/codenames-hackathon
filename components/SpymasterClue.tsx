import { sendAction } from "@/lib/state/gameMachineUtil";
import { activeTeamColor, playerIsActiveSpymaster } from "@/lib/user";
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GetUserInfo } from "@/lib/hooks/getUserInfo";
import { cn } from "@/lib/util/cn";

const SpymasterClue = ({
  state,
  room,
}: {
  state: any;
  room: string;
}) => {
  const [clue, setClue] = useState("");
  const [clueCount, setClueCount] = useState("0");
  const [isOpen, setIsOpen] = useState(false);
  const [clueEnabled, setClueEnabled] = useState(false);

  const userInfo = GetUserInfo();
  const { userId } = userInfo;

  const clueCountOptions = Array.from({ length: 10 }, (_, i) => i).map(
    (count) => {
      return (
        <li
          onClick={() => {
            setIsOpen(false);
            setClueCount(`${count}`);
            setClueEnabled(true);
          }}
          key={count}
          className="cursor-pointer border p-1 px-2 h-7 w-7 text-sm bg-slate-700 text-primary-foreground"
        >
          {count}
        </li>
      );
    }
  );

  return (
    <div className='h-8 flex gap-2'>
      {playerIsActiveSpymaster(state, userId) && (
        <>
          <input
            type="text"
            className="bg-gray-200 appearance-none font-bold border-2 border-gray-200 rounded w-48 py-2 px-4 text-slate-700 leading-tight focus:outline-none focus:bg-white"
            onChange={(e) => setClue(e.target.value)}
          />
          <Popover
            open={isOpen}
            onOpenChange={(open) => {
              setIsOpen(open);
            }}
          >
            <PopoverTrigger>
              <div className=" border p-1 h-8 w-8 rounded-lg border-slate-300 bg-black text-slate-200">
                {clueCount}
              </div>
            </PopoverTrigger>
            <PopoverContent className="bg-slate-500 w-96 h-16">
              <ul className="flex gap-1.5">
                {clueCountOptions}
                <li
                  onClick={() => {
                    setIsOpen(false);
                    setClueCount("ꝏ");
                  }}
                  className="cursor-pointer border p-1 px-2 h-7 w-7 text-sm bg-slate-700 text-primary-foreground"
                >
                  ꝏ
                </li>
              </ul>
            </PopoverContent>
          </Popover>
          <button
            onClick={() => {
              if (!clue) return;
              sendAction({
                action: "give.clue",
                room,
                userInfo,
                payload: JSON.stringify({ clue, clueCount }),
              });
            }}
            disabled={!clueEnabled}
            className={cn("bg-green-700 text-white p-1 rounded-xl w-28", !clueEnabled && 'bg-slate-800 cursor-default')}
          >
            Give Clue
          </button>
        </>
      )}
    </div>
  );
};

export default SpymasterClue;

"use client";
//bg-red-500 bg-blue-500 bg-black bg-yellow-200 bg-neutral
// tailwind hack to make sure dynamic colors are available
import { useContext } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { GlobalStateContext } from "@/components/context/GlobalState";
import { useActor } from '@xstate/react';

import TeamCard from '@/components/TeamCard'
import GameCard from "@/components/GameCard";

import PlayersPane from "@/components/presence/PlayersPane";

export default function Home() {
  const location = 'lobby';
  const globalServices = useContext(GlobalStateContext);
  
  if (!globalServices) throw new Error('No context provider');
  const [state, send] = useActor(globalServices.gameService);

  const { isLoaded, user } = useUser();
  const userId = user ? user.id : '';
  const username = user?.username;
  const words = useQuery(api.words.getWordsForGame);

  return (
    <main className="flex">
      <div className="flex w-80 h-screen bg-red-700 place-content-center place-items-center">
        <TeamCard color='red' />
      </div>
      <div className="w-full flex flex-col">
        <div className="bg-slate-600 h-full">
          { state.matches('lobby') ? <button onClick={() => send({type: 'start.game'})}>Start Game</button> : null }
          { user? <PlayersPane user={user} /> : null }
        </div>
        <div className="grid grid-cols-5 bg-slate-500 place-items-center place-content-center gap-4 p-10">
          {words?.map((word) => (<GameCard key={word._id} word={word} />))}
        </div>
        <div className="bg-slate-600 h-full">
          <div>Game Log</div>
          <div>{state.context.clue}</div>
        </div>
      </div>

      <div className="flex flex-col w-80 h-screen bg-red-700 place-content-center place-items-center">
        <div className="absolute top-4 right-4 flex gap-4 place-content-center place-items-center">
          {username} <UserButton afterSignOutUrl="/" />
        </div>
        <TeamCard color='blue' />
      </div>
    </main>
  );
}

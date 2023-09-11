"use client";
//bg-red-700 bg-blue-700 bg-black bg-yellow-200 bg-neutral bg-blue-500 bg-red-500
// tailwind hack to make sure dynamic colors are available
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { GlobalStateContext } from "@/components/context/GlobalState";

import TeamCard from '@/components/TeamCard'
import GameCard from "@/components/GameCard";

import PlayersPane from "@/components/presence/PlayersPane";
import { sendAction, StateFromDb } from "@/lib/state/gameMachineUtil";
import { State, interpret } from "xstate";
import { GameContext, gameMachine } from "@/lib/state/gameMachine";

export default function Home() {
  const location = 'lobby';
  
  const { isLoaded, user } = useUser();
  const userId = user ? user.id : '';
  const username = user?.username;


  const latestStateFromDB = useQuery(api.gameflow.get, { room: 'lobby' })

  const stateDef = latestStateFromDB ?  JSON.parse(latestStateFromDB.state) : gameMachine.initialState;
  
  const state = State.create(StateFromDb()) as State<GameContext>;
  const context = state.context as GameContext;
  const service = interpret(gameMachine).start(state);

  const resetGameState = () => {
    fetch('http://localhost:3000/api/gameflow/', { method: 'PUT', body: JSON.stringify({ room: 'lobby' }) })
  }

  const startGame = () => {
    sendAction('start.game')
  }

  return (
    <main className="flex">
      <div className="flex w-80 h-screen bg-red-700 place-content-center place-items-center">
        <TeamCard state={state} color='red' />
      </div>
      <div className="w-full flex flex-col">
        <div className="bg-slate-600 h-full">
          <button onClick={resetGameState}>Reset State</button>
          { state.matches('lobby') ? <button onClick={startGame}>Start Game</button> : null }
          {/* { user? <PlayersPane user={user} /> : null } */}
        </div>
        <div className="grid grid-cols-5 bg-slate-500 place-items-center place-content-center gap-4 p-10">
          {context.cards.map((card) => (<GameCard key={card.word} card={card} />))}
        </div>
        <div className="bg-slate-600 h-full">
          <div>Game Log</div>
          <div>{context.clue}</div>
        </div>
      </div>

      <div className="flex flex-col w-80 h-screen bg-red-700 place-content-center place-items-center">
        <div className="absolute top-4 right-4 flex gap-4 place-content-center place-items-center">
          {username} <UserButton afterSignOutUrl="/" />
        </div>
        <TeamCard state={state} color='blue' />
      </div>
    </main>
  );
}

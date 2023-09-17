"use client";
// border-red-700 border-blue-700 bg-red-950 bg-blue-950 border-red-900 border-blue-900

import React, { useState } from "react";
import GameCard from "./GameCard";
import TeamCard from "./TeamCard";
import { State } from "xstate";

import { sendAction } from "@/lib/state/gameMachineUtil";
import { GameContext } from "@/lib/state/gameMachine";

import SpymasterClue from "@/components/SpymasterClue";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import GameRules from "./GameRules";
import Modal from "./Modal";
import { activeTeamColor, playerIsOnTeam } from "@/lib/user";
import { GetUserInfo } from "@/lib/hooks/getUserInfo";

const wrapper = (children: any, state: any, room: string) => {
  return (
    <div className='flex w-full justify-center'>
      <TeamCard state={state} color="red" room={room} />
      {state?.matches("lobby") ? (
        //TODO - only show this button if the user is the host
        <button
          className="absolute top-5 left-10 bg-slate-800 p-2 rounded border border-slate-600"
          onClick={() => sendAction({ action: "start.game", room })}
        >
          Start Game
        </button>
      ) : null}
      <div className="flex flex-col">{children}</div>
      <TeamCard state={state} color="blue" room={room} />
    </div>
  );
};

const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const GameArea = ({ room }: { room: string; }) => {
  const userInfo = GetUserInfo();
  const { userId } = userInfo;
  const [isOpen, setIsOpen] = useState(false);

  const progressState = (state: any) => {
    if (Object.values(state.value).includes('spymaster')) {
      sendAction({ action: 'give.clue', room, userInfo, payload: JSON.stringify({ clue: 'test', clueCount: 2 }) })
    }
    if (Object.values(state.value).includes('guessing')) {
      sendAction({ action: 'end.guessing', room, userInfo });
    }
  }
  
  const createGame = (force = false) => {
    const BASE_URL =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    fetch(`${BASE_URL}/api/gameflow/`, {
      method: "PUT",
      body: JSON.stringify({ room, force }),
    });
  };

  const latestStateFromDB = useQuery(api.gameflow.get, { room });
  if (!latestStateFromDB) {
    return (
      <div className="w-full h-screen flex flex-col justify-center content-center">
        <div className="h-8 w-30 mx-auto m-4">Preparing Game...</div>
        <button className='bg-green-700 h-14 text-white p-4 rounded-xl w-48 mx-auto' onClick={() => createGame(true)}>Start New Game</button>
      </div>
    );
  }

  const state = State.create(
    JSON.parse(latestStateFromDB?.state)
  ) as State<GameContext>;
  const activeColor = activeTeamColor(state);

  const child = (
    <div className="flex flex-col gap-4">
      {state?.context.clue && ( <Modal activeColor={activeColor}>
        {state?.context.clue}
      </Modal> )}
      <div className="flex justify-center items-center p-4 gap-4">
        {state?.matches(`${activeColor}team.spymaster`) && (
          <SpymasterClue state={state} room={room} />
        )}
        {state?.matches('gameover') && (
          <div className='text-center flex justify-center gap-6'>
            <h1 className='text-2xl font-bold self-center'>Game Over</h1>
            <h2 className='text-xl font-bold self-center'>{capitalize(state?.context.winner)} Team Wins!</h2>
            <button className='bg-green-700 text-white p-2 px-6 rounded-xl mx-auto' onClick={() => createGame(true)}>New Game</button>

          </div>
        )}

        {
          process.env.NEXT_PUBLIC_DEBUG && (
            <div className='absolute top-14 left-14'><button onClick={() => progressState(state)}>Next State</button></div>
          )
        }

        {state?.context.clue ? (
          <>
            <div
              className={`bg-neutral text-slate-700 font-bold border-2 border-${activeColor}-700 rounded`}
            >
              <div className="h-10 p-2 px-4">{state?.context.clue}</div>
            </div>
            <div
              className={`bg-neutral text-slate-700 font-bold border-2 border-${activeColor}-700 rounded`}
            >
              <div className="h-10 p-2 px-4">{state?.context.clueCount}</div>
            </div>
          </>
        ) : null}

        {state?.context.clue && playerIsOnTeam(state, activeColor, userId) ? (
          <div
            className={`border-2 h-12 bg-${activeColor}-950 border-${activeColor}-900 p-2 px-4 rounded`}
          >
            <button
              onClick={() => sendAction({ action: "end.guessing", room, userInfo })}
            >
              End Guessing
            </button>
          </div>
        ) : null}
      </div>

      {state?.matches("lobby") ? (
        <GameRules />
      ) : (
        <div className="grid grid-cols-5 bg-slate-600 rounded-xl place-items-center place-content-center gap-4 p-10 max-w-7xl w-full">
          {state?.context.cards?.map((card: any, idx: number) => (
            <GameCard key={idx} idx={idx} card={card} room={room} />
          ))}
        </div>
      )}
      <div className="bg-slate-600 h-24 w-5/6 max-w-2xl mx-auto p-2 rounded overflow-auto">
        <ul>
            {state?.context?.gameLog?.map((log: any, idx: number) => (
              <li key={idx} className='text-xs'>
                {log}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
  return wrapper(child, state, room);
};

export default GameArea;

"use client";
import React, { use, useEffect } from "react";
import GameCard from "./GameCard";
import TeamCard from "./TeamCard";
import { State } from "xstate";

import { sendAction } from "@/lib/state/gameMachineUtil";
import { GameContext } from "@/lib/state/gameMachine";
import { getUserInfo } from "@/lib/hooks/getUserInfo";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import GameRules from "./GameRules";

const GameArea = ({ room }: { room: string }) => {
  const resetGameState = () => {
    fetch(`/api/gameflow/`, {
      method: "PUT",
      body: JSON.stringify({ room: room }),
    });
  };

  const wrapper = (children: any) => {
    return (
      <>
        <div className="flex w-80 h-screen bg-red-700 place-content-center place-items-center">
          <TeamCard state={state} color="red" room={room} />
        </div>
        <div className="w-full flex flex-col">{children}</div>

        <div className="flex flex-col w-80 h-screen bg-red-700 place-content-center place-items-center">
          <div className="absolute top-4 right-4 flex gap-4 place-content-center place-items-center"></div>
          <TeamCard state={state} color="blue" room={room} />
        </div>
      </>
    );
  };

  const { nickname, userId } = getUserInfo();

  const latestStateFromDB = useQuery(api.gameflow.get, { room });
  if (!latestStateFromDB)
    return <button onClick={() => resetGameState()}>Reset State</button>;

  const startGame = () => {
    sendAction({ action: "start.game", room });
  };
  if (!latestStateFromDB) return null;
  const state = State.create(
    JSON.parse(latestStateFromDB?.state)
  ) as State<GameContext>;

  // if (!state.matches('lobby')) {
  //   const child = (
  //     <>
  //       <div className='bg-slate-600 h-full'></div>
  //     </>
  //   )
  //   return wrapper(child);
  // }

  const child = (
    <>
      <div className="bg-slate-600 h-full">
        <button onClick={() => resetGameState()}>Reset State</button>
        {state.matches("lobby") ? (
          <button onClick={startGame}>Start Game</button>
        ) : null}
      </div>
      {state.matches("lobby") ? (
        <GameRules />
      ) : (
        <div className="grid grid-cols-5 bg-slate-500 place-items-center place-content-center gap-4 p-10">
          {state.context.cards.map((card: any, idx: number) => (
            <GameCard key={idx} idx={idx} card={card} room={room} />
          ))}
        </div>
      )}
      <div className="bg-slate-600 h-full">
        <div>Game Log</div>
        <div>{state.context.clue}</div>
      </div>
    </>
  );
  return wrapper(child);
};

export default GameArea;

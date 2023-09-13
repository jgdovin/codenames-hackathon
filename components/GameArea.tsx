"use client";
import React, { use, useEffect } from "react";
import GameCard from "./GameCard";
import TeamCard from "./TeamCard";
import { State } from "xstate";

import { sendAction } from "@/lib/state/gameMachineUtil";
import { GameContext } from "@/lib/state/gameMachine";
import { GetUserInfo } from "@/lib/hooks/getUserInfo";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import GameRules from "./GameRules";

const wrapper = (children: any, state: any, room: string) => {
  return (
    <>
      <TeamCard state={state} color="red" room={room} />
      <div className="w-full flex flex-col">{children}</div>
      <TeamCard state={state} color="blue" room={room} />
    </>
  );
};


const GameArea = ({ room }: { room: string }) => {
  const createGame = (force = false) => {
    fetch(`/api/gameflow/`, {
      method: "PUT",
      body: JSON.stringify({ room, force }),
    });
  };


  const latestStateFromDB = useQuery(api.gameflow.get, { room });
  if (!latestStateFromDB) {
    createGame();
    return <div className='w-full h-screen flex justify-center'><div className='h-8 my-auto'>Preparing Game...</div></div>;
  }

  const state = State.create(
    JSON.parse(latestStateFromDB?.state)
  ) as State<GameContext>;

  const child = (
    <>
      <div className="bg-slate-600 h-full">
        <button onClick={() => createGame(true)}>Reset State</button>
        {state.matches("lobby") ? (
          <button onClick={() => sendAction({ action: "start.game", room })}>Start Game</button>
        ) : null}
      </div>
      {state.matches("lobby") ? (
        <GameRules />
      ) : (
        <div className="grid grid-cols-5 bg-slate-500 place-items-center place-content-center gap-4 p-10">
          {state.context.cards?.map((card: any, idx: number) => (
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
  return wrapper(child, state, room);
};

export default GameArea;

'use client';
import React, { use, useEffect } from "react";
import GameCard from "./GameCard";
import TeamCard from "./TeamCard";
import { State } from "xstate";

import { sendAction } from "@/lib/state/gameMachineUtil";
import { GameContext } from "@/lib/state/gameMachine";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const GameArea = ({ room }: { room: string }) => {
  const [nickname, setNickname] = React.useState("");
  const [userId, setUserId] = React.useState("");

  useEffect(() => {
    const nickname = localStorage.getItem("nickname");
    const userId = localStorage.getItem("userId");
    if (nickname && userId) {
      setUserId(userId);
      setNickname(nickname);
    } else {
      window.location.href = "/";
    }

  },[]);

  const latestStateFromDB = useQuery(api.gameflow.get, { room });

  const resetGameState = () => {
    fetch(`/api/gameflow/`, {
      method: "PUT",
      body: JSON.stringify({ room: room }),
    });
  };

  const startGame = () => {
    sendAction("start.game", room);
  };
  if (!latestStateFromDB) return null;
  const state = State.create(
    JSON.parse(latestStateFromDB?.state)
  ) as State<GameContext>;

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
  
  if (state.matches('lobby')) {
    const child = (
      <>
        <div className='bg-slate-600 h-full'></div>
      </>
    )
    return wrapper(child);
  }
  
  const child = (
    <>
      <div className="bg-slate-600 h-full">
        <button onClick={() => resetGameState()}>Reset State</button>
        {state.matches("lobby") ? (
          <button onClick={startGame}>Start Game</button>
        ) : null}
      </div>
      <div className="grid grid-cols-5 bg-slate-500 place-items-center place-content-center gap-4 p-10">
        {
          state.context.cards.map((card: any, idx: number) => (
            <GameCard key={idx} idx={idx} card={card} room={room} />
          ))
        }
      </div>
      <div className="bg-slate-600 h-full">
        <div>Game Log</div>
        <div>{state.context.clue}</div>
      </div>
    </>
  );
  return wrapper(child);
};

export default GameArea;

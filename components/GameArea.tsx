"use client";
import React, { useEffect, useState } from "react";
import GameCard from "./GameCard";
import TeamCard from "./TeamCard";
import { State } from "xstate";

import { sendAction } from "@/lib/state/gameMachineUtil";
import { GameContext } from "@/lib/state/gameMachine";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import GameRules from "./GameRules";
import Modal from "./Modal";

const wrapper = (children: any, state: any, room: string) => {
  return (
    <>
      <TeamCard state={state} color="red" room={room} />
      <div className="w-full flex flex-col">{children}</div>
      <TeamCard state={state} color="blue" room={room} />
    </>
  );
};

const GameArea = ({ room, baseUrl }: { room: string, baseUrl: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const createGame = (force = false) => {
    console.log('in here?')
    fetch(`/api/gameflow/`, {
      method: "PUT",
      body: JSON.stringify({ room, force }),
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      createGame();
    }, 1000);
    return () => clearTimeout(timer);
  }, [isOpen, createGame])


  const latestStateFromDB = useQuery(api.gameflow.get, { room });
  if (!latestStateFromDB) {
    createGame();
    return <div className='w-full h-screen flex justify-center'><div className='h-8 my-auto'>Preparing Game...</div></div>;
  }

  const state = State.create(
    JSON.parse(latestStateFromDB?.state)
  ) as State<GameContext>;

  const child  = (
    <div className='flex flex-col gap-4'>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>{state?.context.clue}</Modal>
      <div className="bg-slate-600 h-24 w-5/6 max-w-2xl p-2 rounded mx-auto">
        <button onClick={() => createGame(true)}>Reset State</button>
        {state?.matches("lobby") ? (
          <button onClick={() => sendAction({ action: "start.game", room })}>Start Game</button>
        ) : null}
      </div>
      {state?.matches("lobby") ? (
        <GameRules />
      ) : (
        <div className="grid grid-cols-5 bg-slate-500 place-items-center place-content-center gap-4 p-10 max-w-4xl w-full mx-auto">
          {state?.context.cards?.map((card: any, idx: number) => (
            <GameCard key={idx} idx={idx} card={card} room={room} />
          ))}
        </div>
      )}
      <div className="bg-slate-600 h-24 w-5/6 max-w-2xl mx-auto p-2 rounded">
        <div>Game Log</div>
        <div>{state?.context.clue}</div>
      </div>
    </div>
  );
  return wrapper(child, state, room);
};

export default GameArea;

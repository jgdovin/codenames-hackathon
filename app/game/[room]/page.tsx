//bg-red-700 bg-blue-700 bg-black bg-yellow-200 bg-neutral bg-blue-500 bg-red-500
// tailwind hack to make sure dynamic colors are available

import TeamCard from '@/components/TeamCard'
import GameCard from "@/components/GameCard";

import { sendAction, StateFromDb } from "@/lib/state/gameMachineUtil";
import { State } from "xstate";
import { GameContext, gameMachine } from "@/lib/state/gameMachine";
import GameArea from '@/components/GameArea';

export default async function Home({params} : { params: { room: string }}) {
  const { room } = params;

  return (
    <main className="flex">
      <GameArea room={room} />
    </main>
  );
}

'use client';

import { GiSharpSmile } from 'react-icons/gi'

import { cn } from '@/lib/util/cn'
import { isAnySpymaster } from '@/lib/user';
import { GameCard, GameContext } from '@/lib/state/gameMachine'
import { sendAction } from "@/lib/state/gameMachineUtil";
import { GetUserInfo } from '@/lib/hooks/getUserInfo';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { State } from 'xstate';

const revealCard = (card: any, room: string, idx: number) => {
    sendAction({action: 'reveal.card', room, payload: `${idx}`})
}


const GameCard = ({ card, idx, room }: { card: GameCard, idx: number, room: string }) => {
    const { userId } = GetUserInfo();

    const latestStateFromDB = useQuery(api.gameflow.get, { room });
    if (!latestStateFromDB) return null;
    const state = State.create(
      JSON.parse(latestStateFromDB?.state)
    ) as State<GameContext>;

    const cardColor = isAnySpymaster(state, userId) ? card.color : 'bg-neutral'
    const textColor = card.revealed || isAnySpymaster(state, userId) ? 'text-gray-100' : 'text-gray-700'
    return (
        <>
        <div
            onClick={() => revealCard(card, room, idx)}
            className={cn(
                'w-full h-24 flex items-center justify-center rounded-lg cursor-pointer relative group',
                textColor,
                cardColor
            )}
        >
            <p className="text-xl font-bold">{card.word}</p>
            {
                card.revealed ? <div className={cn('absolute top-0 left-0 w-full h-24 rounded-lg group-hover:warped transition-all duration-700 border border-black border-2', card.color)}><div className='flex justify-center items-center h-full'><GiSharpSmile className='w-10 h-10' /></div></div> : null
            }
            
            
        </div>
        </>
    )
}

export default GameCard

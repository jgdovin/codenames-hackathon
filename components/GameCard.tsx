'use client';

import { GiSharpSmile } from 'react-icons/gi'
import { BsPatchQuestion, BsPatchCheck } from 'react-icons/bs'

import { cn } from '@/lib/util/cn'
import { activeTeamColor, playerIsAnySpymaster, playerIsOnActiveTeam } from '@/lib/user';
import { GameCard, GameContext } from '@/lib/state/gameMachine'
import { sendAction } from "@/lib/state/gameMachineUtil";
import { GetUserInfo } from '@/lib/hooks/getUserInfo';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { State } from 'xstate';
import { useEffect, useRef } from 'react';





const GameCard = ({ card, idx, room }: { card: GameCard, idx: number, room: string }) => {
    const revealCard = (idx: number, activeColor: string) => {
        sendAction({action: 'reveal.card', room, payload: JSON.stringify({id: idx, activeColor})})
    }
    const { userId } = GetUserInfo();
    const ref = useRef(null);
    useEffect(() => {
        setTimeout(() => {
            // @ts-ignore
            ref.current?.classList.add('group-hover:warped')
        }, 1500)
    }, [card.revealed])
    const latestStateFromDB = useQuery(api.gameflow.get, { room });
    if (!latestStateFromDB) return null;
    const state = State.create(
      JSON.parse(latestStateFromDB?.state)
    ) as State<GameContext>;
    const activeColor = activeTeamColor(state);
    const cardColor = playerIsAnySpymaster(state, userId) ? card.color : 'bg-neutral'
    const textColor = card.revealed || playerIsAnySpymaster(state, userId) ? 'text-gray-100' : 'text-gray-700'

    const guessing = () => {
        if (!Object.values(state.value).includes('guessing')) return false;
        if (!playerIsOnActiveTeam(state, userId)) return false;
        return true;
      }

    return (
        <>
        <div
            className={cn(
                'w-full h-24 flex items-center justify-center rounded-lg relative group',
                textColor,
                cardColor
            )}
        >
            <p className="text-xl font-bold">{card.word}</p>
            { guessing() && playerIsOnActiveTeam(state, userId) ?
            <div className='w-16 p-1 h-6 absolute top-0 right-0 flex justify-evenly'>
                <BsPatchQuestion className='h-5 w-5' />
            
                <BsPatchCheck onClick={() => revealCard(idx, activeColor)} className='h-5 w-5 cursor-pointer' />
            </div> : null }
            {
                card.revealed ? <div ref={ref} className={cn('absolute top-0 left-0 w-full h-24 rounded-lg transition-all duration-700 border-black border-2', card.color)}><div className='flex justify-center items-center h-full'><GiSharpSmile className='w-10 h-10' /></div></div> : null
            }
            
            
        </div>
        </>
    )
}

export default GameCard

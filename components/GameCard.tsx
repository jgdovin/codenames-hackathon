'use client';

import { cn } from '@/lib/util/cn'
import { GameCard } from '@/lib/state/gameMachine'
import { sendAction } from "@/lib/state/gameMachineUtil";

const revealCard = (card: any, room: string, idx: number) => {
    sendAction({action: 'reveal.card', room, payload: `${idx}`})
}

const GameCard = ({ card, idx, room }: { card: GameCard, idx: number, room: string }) => {
    const cardColor = card.revealed ? card.color : 'bg-neutral'
    const textColor = card.revealed ? 'text-gray-100' : 'text-gray-700'
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
            <p className="text-3xl">{card.word}</p>
            {
                card.revealed ? <div className={cn('absolute top-0 left-0 w-full h-24 rounded-lg group-hover:warped transition-all duration-700 border border-black border-2', card.color)} /> : null
            }
            
            
        </div>
        </>
    )
}

export default GameCard

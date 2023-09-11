import { cn } from '@/lib/util/cn'
import { GameCard } from '@/lib/state/gameMachine'


const GameCard = ({ card }: { card: GameCard }) => {
    
    return (
        <div
            className={cn(
                'w-full h-24 flex items-center justify-center rounded-lg cursor-pointer ',
                card.color
            )}
        >
            <p className="text-3xl">{card.word}</p>
        </div>
    )
}

export default GameCard

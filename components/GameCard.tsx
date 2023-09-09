import { cn } from '@/lib/util/cn'

type GameCardProps = {
    _id: string
    word: string
    color: string
}

const GameCard = ({ word }: { word: GameCardProps }) => {
    return (
        <div
            className={cn(
                'w-full h-24 flex items-center justify-center rounded-lg cursor-pointer ',
                word.color
            )}
        >
            <p className="text-3xl">{word.word}</p>
        </div>
    )
}

export default GameCard

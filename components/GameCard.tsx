'use client';

import { GiSharpSmile } from 'react-icons/gi';
import { BsPatchCheck } from 'react-icons/bs';
import { MdOutlineThumbsUpDown, MdThumbsUpDown } from 'react-icons/md';

import { cn } from '@/lib/util/cn';
import {
  activeTeamColor,
  playerIsAnySpymaster,
  playerIsOnActiveTeam,
} from '@/lib/user';
import { GameCard, GameContext } from '@/lib/state/gameMachine';
import { sendAction } from '@/lib/state/gameMachineUtil';
import { GetUserInfo } from '@/lib/hooks/getUserInfo';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { State } from 'xstate';
import { useEffect, useRef } from 'react';

const GameCard = ({
  card,
  idx,
  room,
}: {
  card: GameCard;
  idx: number;
  room: string;
}) => {
    const userInfo = GetUserInfo();
  const revealCard = (idx: number, activeColor: string) => {
    sendAction({
      action: 'reveal.card',
      userInfo,
      room,
      payload: JSON.stringify({ id: idx, activeColor }),
    });
  };
  const voteCard = (idx: number, userId: string, unvote = false) => {
    if (unvote) {
      sendAction({
        action: 'unVote.card',
        room,
        payload: JSON.stringify({ cardId: idx, userId }),
      });
    } else {
      sendAction({
        action: 'vote.card',
        room,
        payload: JSON.stringify({ cardId: idx, userId }),
      });
    }
  };

  const { userId } = userInfo;
  const ref = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      // @ts-ignore
      ref.current?.classList.add('group-hover:warped');
    }, 1500);
  }, [card.revealed]);
  const latestStateFromDB = useQuery(api.gameflow.get, { room });
  if (!latestStateFromDB) return null;
  const state = State.create(
    JSON.parse(latestStateFromDB?.state)
  ) as State<GameContext>;
  const activeColor = activeTeamColor(state);
  const cardColor = playerIsAnySpymaster(state, userId)
    ? card.color
    : 'bg-neutral';
  const textColor =
    (playerIsAnySpymaster(state, userId) && card.color !== 'bg-neutral') || (card.revealed && card.color !== 'bg-neutral')
      ? 'text-slate-100'
      : 'text-slate-800';

  const guessing = Object.values(state.value).includes('guessing');

  return (
    <>
      <div
        className={cn(
          'w-full h-24 flex items-center justify-center rounded-lg border-2 border-black relative group',
          textColor,
          cardColor
        )}
      >
        <p className='text-xl font-bold overflow-hidden overflow-ellipsis p-2 rounded'>{card.word}</p>
        {guessing ? (
          <>
            {card.votes.length || true ? (
              <div className='flex flex-wrap content-end h-full absolute top-0 left-0 w-full p-0.5 gap-0.5'>
                {card.votes.map((vote) => (
                  <div
                    key={vote}
                    className='h-4 w-16 text-xs self-end overflow-hidden overflow-ellipsis pl-1 bg-[#b99d78] text-black font-bold border border-black rounded'
                  >
                    {state.context.players[vote]}
                  </div>
                ))}
              </div>
            ) : null}

            {playerIsOnActiveTeam(state, userId) &&
            !playerIsAnySpymaster(state, userId) ? (
              <div className='w-16 p-1 h-6 absolute top-0 right-0 flex justify-evenly'>
                {card.votes.includes(userId) ? (
                  <MdThumbsUpDown
                    onClick={() => voteCard(idx, userId, true)}
                    className='h-5 w-5 cursor-pointer'
                  />
                ) : (
                  <MdOutlineThumbsUpDown
                    onClick={() => voteCard(idx, userId)}
                    className='h-5 w-5 cursor-pointer'
                  />
                )}

                <BsPatchCheck
                  onClick={() => revealCard(idx, activeColor)}
                  className='h-5 w-5 cursor-pointer'
                />
              </div>
            ) : null}
          </>
        ) : null}
        {card.revealed ? (
          <div
            ref={ref}
            className={cn(
              'absolute top-0 left-0 w-full h-24 rounded-lg transition-all duration-700 border-black border-2',
              card.color
            )}
          >
            <div className='flex justify-center items-center h-full'>
              <GiSharpSmile className='w-10 h-10' />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default GameCard;

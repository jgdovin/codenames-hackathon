'use client';
//text-red-800 text-blue-800 bg-blue-500 bg-red-500 bg-blue-900 bg-red-900 bg-blue-800 bg-red-800 shadow-blue-200 shadow-red-200
import { useState } from 'react';
import { sendAction } from '@/lib/state/gameMachineUtil';
import { GetUserInfo } from '@/lib/hooks/getUserInfo';
import {
  activeTeamColor,
  playerIsSpymaster,
  playerIsOnAnyTeam,
  playerIsOnTeamAndNoSpymaster,
  teamIsGuessing,
} from '@/lib/user';

const TeamCard = ({
  color,
  state,
  room,
}: {
  color: string;
  state: any;
  room: string;
}) => {
  const { nickname, userId } = GetUserInfo();
  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  const capitalTC = capitalize(color);
  const userInfo = { nickname, userId };

  const joinTeam = () => {
    sendAction({ action: 'join.team', room, userInfo, payload: color });
  };

  const joinSpymaster = () => {
    sendAction({ action: 'join.spymaster', room, userInfo, payload: color });
  };

  if (!state) return null;

  return (
    <div className='flex flex-col w-80 bg-slate-700 pt-20 place-items-center text-slate-100'>
      <div className='h-12 w-full text-center px-8 mb-4'>
      {state.matches(`${color}team.guessing`) && (
          <h1 className='text-center'>
            {capitalTC} Team is Guessing
          </h1>
        )}
        {state.matches(`${color}team.spymaster`) && (
          <h1 className='text-center'>
            {capitalTC} Team Spymaster is giving a clue
          </h1>
        )}
        
      </div>
      <div
        className={`w-5/6 bg-${color}-900 h-96 p-4 rounded-xl border flex flex-col gap-4`}
      >
        <p className='text-center mb-2'>
          {capitalTC} Team{' '}
          {!state.matches('lobby') &&
            `(${state.context[`${color}teamCardsRemaining`]})`}
        </p>
        <div className='border-1 rounded-lg p-2'>
          <h1 className={`text-center`}>Operatives</h1>
          <hr />
          {!playerIsOnAnyTeam(state, userId) ? (
            <div className='text-center'>
              <button
                className={`bg-slate-800 p-2 rounded-lg m-2 text-xs`}
                onClick={() => {
                  joinTeam();
                }}
              >
                Join Team
              </button>
            </div>
          ) : (
            <></>
          )}
          <ul>
            {state.context[`${color}Team`]?.map((member: any, idx: number) => {
              return (
                <li className='ml-4 text-xs my-2' key={idx}>
                  {state.context.players[member]}
                </li>
              );
            })}
          </ul>
        </div>
        <div className='border-1 rounded-lg p-2'>
          <h1 className={`text-slate-300 text-center mt-4`}>Spymaster</h1>
          <hr />
          <p className='ml-4 text-xs my-2'>
            {state.context.players[state.context[`${color}Spymaster`]]}
          </p>
          {playerIsOnTeamAndNoSpymaster(state, color, userId) ? (
            <div className='text-center'>
              <button
                className={`bg-slate-800 p-2 m-2 text-xs border-gray-400 rounded shadow`}
                onClick={() => {
                  joinSpymaster();
                }}
              >
                Become Spymaster
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;

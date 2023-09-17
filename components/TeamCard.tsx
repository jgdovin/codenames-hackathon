'use client';
//bg-blue-900 bg-red-900 shadow-red-800 shadow-blue-800 border-red-800 border-blue-800 border-slate-600 shadow-slate-600
import { sendAction } from '@/lib/state/gameMachineUtil';
import { GetUserInfo } from '@/lib/hooks/getUserInfo';
import {
  activeTeamColor,
  playerIsOnAnyTeam,
  playerIsOnTeamAndNoSpymaster,
} from '@/lib/user';
import { cn } from '@/lib/util/cn';

const TeamCard = ({
  color,
  state,
  room,
}: {
  color: string;
  state: any;
  room: string;
}) => {
  const { userId } = GetUserInfo();
  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  const capitalTC = capitalize(color);
  const userInfo = GetUserInfo();

  const joinTeam = () => {
    sendAction({ action: 'join.team', room, userInfo, payload: color });
  };

  const joinSpymaster = () => {
    sendAction({ action: 'join.spymaster', room, userInfo, payload: color });
  };

  if (!state) return null;

  const bgColor =
    activeTeamColor(state) === color ? `bg-${color}-900` : 'bg-slate-700';
  const shadowColor =
    activeTeamColor(state) === color ? `${color}-800` : 'slate-600';

  return (
    <div className='flex w-64 flex-col place-items-center bg-slate-700 pt-20 text-slate-100'>
      <div className='mb-4 min-h-[60px] w-full px-8 text-center'>
        {state.matches(`${color}team.guessing`) && (
          <h1 className='text-center'>{capitalTC} Team is Guessing</h1>
        )}
        {state.matches(`${color}team.spymaster`) && (
          <h1 className='text-center'>
            {capitalTC} Team Spymaster is giving a clue
          </h1>
        )}
      </div>
      <div
        className={cn(
          `hover:shadow-2x flex h-96 w-5/6 transform flex-col gap-4 rounded-xl border border-slate-500 p-2 transition duration-500 ease-in-out hover:scale-105`,
          bgColor,
        )}
      >
        <p className='mb-2 text-center'>
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
                className={`m-2 rounded-lg bg-slate-800 p-2 text-xs`}
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
          <ul className='flex flex-col justify-center gap-2 pt-4'>
            {state.context[`${color}Team`]?.map((member: any, idx: number) => {
              return (
                <>
                  <li
                    className={cn(
                      `w-28 self-center p-1 text-center text-xs shadow-md shadow-${shadowColor} rounded  border-2 border-${shadowColor}`,
                    )}
                    key={idx}
                  >
                    {state.context.players[member]}
                  </li>
                </>
              );
            })}
          </ul>
        </div>
        <div className='border-1 rounded-lg p-2'>
          <h1 className={`mt-4 text-center text-slate-300`}>Spymaster</h1>
          <hr />
          <p className='my-2 ml-4 text-xs'>
            {state.context.players[state.context[`${color}Spymaster`]]}
          </p>
          {state.context[`${color}Spymaster`] && (
            <ul className='flex flex-col justify-center gap-2 pt-4'>
              <li
                className={cn(
                  `w-28 self-center rounded p-1 text-center text-xs shadow-md shadow-${shadowColor} border-2  border-${shadowColor}`,
                )}
              >
                {state.context.players[state.context[`${color}Spymaster`]]}
              </li>
            </ul>
          )}
          {playerIsOnTeamAndNoSpymaster(state, color, userId) ? (
            <div className='flex justify-center text-center'>
              <button
                className={`m-2 w-32 self-center rounded border-gray-400 bg-slate-800 p-2 text-xs shadow`}
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

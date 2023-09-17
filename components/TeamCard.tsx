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
  const shadowColor = activeTeamColor(state) === color ? `${color}-800` : 'slate-600';

  return (
    <div className='flex flex-col w-64 bg-slate-700 pt-20 place-items-center text-slate-100'>
      <div className='w-full text-center px-8 mb-4 min-h-[60px]'>
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
          `w-5/6 h-96 p-2 rounded-xl border border-slate-500 flex flex-col gap-4 transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-2x`,
          bgColor
        )}
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
          <ul className='flex flex-col justify-center pt-4 gap-2'>
            {state.context[`${color}Team`]?.map((member: any, idx: number) => {
              return (
               <> 
               <li className={cn(`text-xs shadow-md self-center p-1 text-center w-28 shadow-${shadowColor} border-2  rounded border-${shadowColor}`)} key={idx}>
                  {state.context.players[member]}
                </li>
            </>
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
          {state.context[`${color}Spymaster`] && (
          <ul className='flex flex-col justify-center pt-4 gap-2'>
            <li className={cn(`text-xs shadow-md self-center p-1 text-center w-28 rounded shadow-${shadowColor} border-2  border-${shadowColor}`)}>
            {state.context.players[state.context[`${color}Spymaster`]]}
            </li>
          </ul>
          )}
          {playerIsOnTeamAndNoSpymaster(state, color, userId) ? (
            <div className='text-center flex justify-center'>
              <button
                className={`bg-slate-800 w-32 self-center p-2 m-2 text-xs border-gray-400 rounded shadow`}
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

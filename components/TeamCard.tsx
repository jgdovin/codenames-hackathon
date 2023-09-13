"use client";
//text-red-800 text-blue-800 bg-blue-500 bg-red-500
import { useState } from "react";
import { sendAction } from "@/lib/state/gameMachineUtil";
import { GetUserInfo } from "@/lib/hooks/getUserInfo";
import { playerOnAnyTeam, playerOnCurrentTeamAndNoSpymaster } from "@/lib/user";

const TeamCard = ({
  color,
  state,
  room,
}: {
  color: string;
  state: any;
  room: string;
}) => {
  const [clue, setClue] = useState("");
  const { nickname, userId } = GetUserInfo();
  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  const capitalTC = capitalize(color);
  const userInfo = { nickname, userId };

  const joinTeam = () => {
    sendAction({ action: "join.team", room, userInfo, payload: color });
  };

  const joinSpymaster = () => {
    sendAction({ action: "join.spymaster", room, userInfo, payload: color });
  };

  return (
    <div className="flex w-80 bg-slate-700 h-screen place-content-center place-items-center">
      <div className={`w-5/6 bg-${color}-500 h-96 p-4 rounded-xl`}>
        <p className="text-center mb-2">
          {capitalTC} Team{" "}
          {!state.matches("lobby") &&
            `(${state.context[`${color}teamCardsRemaining`]})`}
        </p>
        <h1 className={`text-slate-800 text-center mt-4`}>Operatives</h1>
        {!playerOnAnyTeam(state, userId) ? (
          <div className="text-center">
            <button
              className={`bg-slate-800 p-2 rounded-lg m-2 text-xs`}
              onClick={() => {
                joinTeam();
              }}
            >
              Join as Operative
            </button>
          </div>
        ) : (
          <></>
        )}
        <hr />
        <ul>
          {state.context[`${color}Team`]?.map((member: any, idx: number) => {
            return (
              <li className="ml-4 text-xs my-2" key={idx}>
                {state.context.players[member]}
              </li>
            );
          })}
        </ul>
        <h1 className={`text-${color}-800 text-center mt-4`}>Spymaster</h1>
        {state.context.players[state.context[`${color}Spymaster`]]}
        {playerOnCurrentTeamAndNoSpymaster(state, color, userId) ? (
          <div className="text-center">
            <button
              className={`bg-${color}-500 p-2 rounded-lg m-2 text-xs`}
              onClick={() => {
                joinSpymaster();
              }}
            >
              Join as Spymaster
            </button>
          </div>
        ) : (
          <></>
        )}
        <hr />
        {state.matches(`${color}team`) ? (
          <div>
            <p>{capitalTC} Team Turn</p>
            {state.matches(`${color}team.spymaster`) ? (
              <>
                <input
                  type="text"
                  className='bg-gray-200 appearance-none text-xs border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                  onChange={(e) => setClue(e.target.value)}
                />
                <button
                  onClick={() => {
                    sendAction({ action: "give.clue", room, payload: clue });
                  }}
                >
                  Give Clue
                </button>
              </>
            ) : (
              <div>
                <button onClick={() => {}}>Submit Guess</button>
                <button
                  onClick={() => {
                    sendAction({ action: "end.turn", room });
                  }}
                >
                  End Guessing
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TeamCard;

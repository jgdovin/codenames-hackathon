'use client';
//text-red-800 text-blue-800
import { useState } from "react";
import { sendAction } from "@/lib/state/gameMachineUtil";
import { GetUserInfo } from "@/lib/hooks/getUserInfo";
import { playerOnAnyTeam, playerOnCurrentTeamAndNoSpymaster } from "@/lib/user";

const TeamCard = ({color, state, room}: {color: string, state: any, room: string}) => {
  const [clue, setClue] = useState('');
  const { nickname, userId } = GetUserInfo();
  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }  
  const capitalTC = capitalize(color);
  const userInfo = {nickname, userId}

  const joinTeam = () => {
    sendAction({action: 'join.team', room, userInfo, payload: color})
  }

  const joinSpymaster = () => {
    sendAction({action: 'join.spymaster', room, userInfo, payload: color})
  }

  return (
    <div className="w-5/6 bg-gray-500 h-96 pt-4 rounded-xl">
          <p className='text-center mb-2'>{capitalTC} Team { !state.matches('lobby') && `(${state.context[`${color}teamCardsRemaining`]})`}</p>
          <h1 className={`text-slate-800 text-center mt-4`}>Operatives</h1>
          { !playerOnAnyTeam(state, userId) ? <div className='text-center'><button className={`bg-slate-800 p-2 rounded-lg m-2 text-xs`} onClick={() => {joinTeam()}}>Join as Operative</button></div> : <></> }
          <hr />
          <ul>
            {state.context[`${color}Team`]?.map((member: any, idx: number) => {
              return <li className='ml-4 text-xs my-2' key={idx}>{state.context.players[member]}</li>
            })}
          </ul>
          <h1 className={`text-${color}-800 text-center mt-4`}>Spymaster</h1>
          {state.context.players[state.context[`${color}Spymaster`]]}
          {
            playerOnCurrentTeamAndNoSpymaster(state, color, userId) ?
            <div className='text-center'><button className={`bg-${color}-500 p-2 rounded-lg m-2 text-xs`} onClick={() => {joinSpymaster()}}>Join as Spymaster</button></div> : <></>
          }
          <hr />
          { state.matches(`${color}team`) ? (
          <div>
            <p>{capitalTC} Team Turn</p>
            {
              state.matches(`${color}team.spymaster`) ?
              <>
                <input type="text" className='text-black' onChange={(e) => setClue(e.target.value)} />
                <button onClick={() => {sendAction({action: 'give.clue', room, payload: clue})}}>Give Clue</button> 
              </>
               :
              <div>
                <button onClick={() => {}}>Submit Guess</button>  
                <button onClick={() => {sendAction({action: 'end.turn', room})}}>End Guessing</button>  
              </div>
            }
          </div>
          ) : null}
    </div>
  )
}

export default TeamCard
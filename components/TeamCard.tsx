'use client';

import { useState, useContext, useEffect } from "react";
import { sendAction } from "@/lib/state/gameMachineUtil";

const TeamCard = ({color, state, room}: {color: string, state: any, room: string}) => {
  const [clue, setClue] = useState('');
  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }  
  const capitalTC = capitalize(color);

  return (
    <div className="w-5/6 bg-gray-500 h-96 pt-4 rounded-xl">
          <p className='text-center mb-2'>{capitalTC} Team { !state.matches('lobby') && `(${state.context[`${color}teamCardsRemaining`]})`}</p>
          <ul>
            {}
          </ul>
          <hr />
          { state.matches(`${color}team`) ? (
          <div>
            <p>{capitalTC} Team Turn</p>
            {
              state.matches(`${color}team.spymaster`) ?
              <>
                <input type="text" className='text-black' onChange={(e) => setClue(e.target.value)} />
                <button onClick={() => {sendAction('give.clue', room, clue)}}>Give Clue</button> 
              </> :
              <div>
                <button onClick={() => {}}>Submit Guess</button>  
                <button onClick={() => {sendAction('end.turn', room)}}>End Guessing</button>  
              </div>
            }
          </div>
          ) : null}
    </div>
  )
}

export default TeamCard
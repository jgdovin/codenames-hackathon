import { GlobalStateContext } from "@/components/context/GlobalState";
import { useActor } from '@xstate/react';
import { useState, useContext } from "react";

const TeamCard = ({color}: {color: string}) => {
  const [clue, setClue] = useState('');
  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  const globalServices = useContext(GlobalStateContext);
  if (!globalServices) throw new Error('No context provider');
  
  const [state, send] = useActor(globalServices.gameService);
  const capitalTC = capitalize(color);
  return (
    <div className="w-5/6 bg-gray-500 h-96">
          <p>{capitalTC} Team</p>
          { state.matches(`${color}team`) ? (
          <div>
            <p>{capitalTC} Team Turn</p>
            {
              state.matches(`${color}team.spymaster`) ?
              <>
                <input type="text" className='text-black' onChange={(e) => setClue(e.target.value)} />
                <button onClick={() => send({type: 'give.clue', value: clue})}>Give Clue</button> 
              </> :
              <div>
                <button onClick={() => { send({type: 'submit.guess'})}}>Submit Guess</button>  
                <button onClick={() => send({type: 'end.turn'})}>End Guessing</button>  
              </div>
            }
          </div>
          ) : null}
    </div>
  )
}

export default TeamCard
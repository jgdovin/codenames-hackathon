import { useState, useContext, useEffect } from "react";

const TeamCard = ({color, state}: {color: string, state: any}) => {
  const [clue, setClue] = useState('');
  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }  
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
                <button onClick={() => {}}>Give Clue</button> 
              </> :
              <div>
                <button onClick={() => {}}>Submit Guess</button>  
                <button onClick={() => {}}>End Guessing</button>  
              </div>
            }
          </div>
          ) : null}
    </div>
  )
}

export default TeamCard
import { useQuery } from 'convex/react';
import { State } from 'xstate'
import { gameMachine } from '@/lib/state/gameMachine';
import { api } from '@/convex/_generated/api';

export const stateFromDb = async () => {
  const latestStateFromDB = useQuery(api.gameflow.get, { room: 'lobby' })
  if (!latestStateFromDB) return null;
  const stateDef = JSON.parse(latestStateFromDB.state) || gameMachine.initialState;
  
  return await State.create(stateDef);
}
import { useQuery } from 'convex/react';
import { gameMachine } from '@/lib/state/gameMachine';
import { api } from '@/convex/_generated/api';

export const StateFromDb = (room: string) => {
  const latestStateFromDB = useQuery(api.gameflow.get, { room })
  if (!latestStateFromDB) return gameMachine.initialState;
  return JSON.parse(latestStateFromDB.state) || gameMachine.initialState;
}

export const sendAction = (action: string, room: string, value = '') => {
  fetch(`/api/gameflow/`, { method: 'POST', body: JSON.stringify({ room, action, value}) })
}
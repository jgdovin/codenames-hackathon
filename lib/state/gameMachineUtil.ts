import { useQuery } from 'convex/react';
import { gameMachine } from '@/lib/state/gameMachine';
import { api } from '@/convex/_generated/api';

export const stateFromDb = () => {
  const latestStateFromDB = useQuery(api.gameflow.get, { room: 'lobby' })
  if (!latestStateFromDB) return gameMachine.initialState;
  return JSON.parse(latestStateFromDB.state) || gameMachine.initialState;
}

export const sendAction = (action: string, value = '') => {
  fetch('http://localhost:3000/api/gameflow/', { method: 'POST', body: JSON.stringify({ room: 'lobby', action, value}) })
}
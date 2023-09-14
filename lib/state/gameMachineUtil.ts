const { ConvexHttpClient } = require('convex/browser');
const { api } = require('@/convex/_generated/api');


export const StateFromDb = async (room: string) => {
  const client = new ConvexHttpClient(process.env["CONVEX_URL"]);
  const res = await client.query(api.gameflow.get, { room } );
  return res;
}

export const sendAction = ({action, room, userInfo, payload}: {action: string, room: string, userInfo?: object, payload?: string}) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const user = JSON.stringify(userInfo || '{}');
  fetch(`${BASE_URL}/api/gameflow/`, { method: 'POST', body: JSON.stringify({ room, action, payload, user}) })
}
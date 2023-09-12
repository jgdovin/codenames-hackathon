const { ConvexHttpClient } = require('convex/browser');
const { api } = require('@/convex/_generated/api');


export const StateFromDb = async (room: string) => {
  const client = new ConvexHttpClient(process.env["CONVEX_URL"]);
  const res = await client.query(api.gameflow.get, { room } );
  return res;
}

export const sendAction = (action: string, room: string, value = '') => {
  fetch(`/api/gameflow/`, { method: 'POST', body: JSON.stringify({ room, action, value}) })
}
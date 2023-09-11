
const { ConvexHttpClient } = require('convex/browser');
const { api } = require('@/convex/_generated/api');
const client = new ConvexHttpClient(process.env["CONVEX_URL"]);
import { gameMachine } from '@/lib/state/gameMachine';

export async function POST(request: Request) {
  const data = await request.json();

  const workflowData = await client.query(api.gameflow.get, { room: data.room });

  if (!workflowData) throw new Error('no gameflow machine available');

  const newState = gameMachine.transition(gameMachine.resolveState(JSON.parse(workflowData.state)), {type: data.action, value: data.value});

  client.mutation(api.gameflow.post, { room: data.room, state: JSON.stringify(newState) });

  return new Response(JSON.stringify(newState.value), { status: 200 });
}

export async function PUT(request: Request) {
  const data = await request.json();
  await client.mutation(api.gameflow.createGame, { room: data.room});
  return new Response('ok', { status: 200 });
}

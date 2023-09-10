
const { ConvexHttpClient } = require('convex/browser');
const { api } = require('@/convex/_generated/api');
const client = new ConvexHttpClient(process.env["CONVEX_URL"]);
import { gameMachine } from '@/lib/state/gameMachine';

export async function GET(request: Request) {
  const workflowData = await client.query(api.gameflow.get);

  return new Response('ok', { status: 200 });
}

export async function POST(request: Request) {
  const data = await request.json();
  console.log(0)
  const workflowData = await client.query(api.gameflow.get, { room: 'lobby' });

  if (!workflowData) throw new Error('no gameflow machine available');

  const newState = gameMachine.transition(gameMachine.resolveState(JSON.parse(workflowData.state)), {type: data.action});

  client.mutation(api.gameflow.post, { room: 'lobby', state: JSON.stringify(newState) });

  return new Response(JSON.stringify(newState.value), { status: 200 });
}

export async function PUT(request: Request) {
  const test = await client.mutation(api.gameflow.update, { room: 'lobby', state: JSON.stringify(gameMachine.initialState), machine: JSON.stringify(gameMachine) });
  return new Response('ok', { status: 200 });
}

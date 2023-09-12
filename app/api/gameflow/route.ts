
const { ConvexHttpClient } = require('convex/browser');
const { api } = require('@/convex/_generated/api');
const client = new ConvexHttpClient(process.env["CONVEX_URL"]);
import { GameContext, gameMachine } from '@/lib/state/gameMachine';
import { StateFromDb } from '@/lib/state/gameMachineUtil';
import { State, interpret } from 'xstate';

export async function POST(request: Request) {
  const data = await request.json();
  const oldStateFromDb = await StateFromDb(data.room);
  const previousState = State.create(JSON.parse(oldStateFromDb.state)) as State<GameContext>;
  const service = interpret(gameMachine).start(previousState);
  service.send({ type: data.action, value: data.value, room: data.room });
  const newState = service.getSnapshot()
  // const newState = gameMachine.transition(gameMachine.resolveState(JSON.parse(workflowData.state)), {type: data.action, value: data.value});
  // console.log(newState.value)
  client.mutation(api.gameflow.post, { room: data.room, state: JSON.stringify(newState) });

  return new Response('ok', { status: 200 });
}

export async function PUT(request: Request) {
  const data = await request.json();
  await client.mutation(api.gameflow.createGame, { room: data.room});
  return new Response('ok', { status: 200 });
}

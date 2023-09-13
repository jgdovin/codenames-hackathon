
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

  service.send({ type: data.action, payload: data.payload, room: data.room, user: data.user });
  const newState = service.getSnapshot()

  client.mutation(api.gameflow.post, { room: data.room, state: JSON.stringify(newState) });

  return new Response('ok', { status: 200 });
}

export async function PUT(request: Request) {
  const data = await request.json();
  const existingState = await StateFromDb(data.room);
  if (!existingState || data.force) await client.mutation(api.gameflow.createGame, { room: data.room});
  return new Response('ok', { status: 200 });
}

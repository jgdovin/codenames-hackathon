// deno-lint-ignore-file no-unreachable
import { createMachine } from 'https://cdn.skypack.dev/pin/xstate@v4.38.2-xqfAyh4LatbCgydDXwWI/mode=imports,min/optimized/xstate.js';
// import { connect } from 'https://unpkg.com/@planetscale/database@^0.6.1';

  export default async function (request: Request) {
    // if request method is PUT, override
    // const db = connect({ url: Deno.env.get('PLANETSCALE_DB_URL') });
  
    // to reset the state machine, send a PUT request
    if (request.method === 'PUT') {
      // await db.execute(
      //   'UPDATE workflows SET state = ?, machine = ? WHERE id = ?;',
      //   [
      //     JSON.stringify(trafficLightMachine.initialState),
      //     JSON.stringify(trafficLightMachine),
      //     1,
      //   ],
      // );
      console.log('its a put')
      return new Response('ok', { status: 200 });
    }
  
    if (request.method === 'POST') {
      // events are sent here
      const data = await request.json();
  
      console.log(JSON.stringify(data, null, 2));
  
      // const { rows } = await db.execute('SELECT * FROM workflows WHERE id = ?;', [
      //   1,
      // ]);
      // const workflowData = rows[0];
  
      // const nextState = trafficLightMachine.transition(
      //   trafficLightMachine.resolveState(workflowData.state),
      //   data,
      // );
  
      // console.log({ nextState });
  
      // await db.execute('UPDATE workflows SET state = ? WHERE id = ?;', [
      //   JSON.stringify(nextState),
      //   1,
      // ]);
  
      return new Response('updated', {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  
    // const results = await db.execute('SELECT * FROM workflows WHERE id = ?', [1]);
    console.log('get?')
    return new Response(JSON.stringify({message: 'success'}), {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

export const config = { path: "/gameflow" };
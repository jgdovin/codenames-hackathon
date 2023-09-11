const { ConvexHttpClient } = require('convex/browser');
const { api } = require('@/convex/_generated/api');
const client = new ConvexHttpClient(process.env["CONVEX_URL"]);

export async function GET(request: Request) {
  const words = await client.query(api.words.getWordsForGame);

  return new Response(JSON.stringify(words), { status: 200 });
}

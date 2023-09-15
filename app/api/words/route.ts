import jsonData from '@/data/sampleWords.json';

const { ConvexHttpClient } = require('convex/browser');
const { api } = require('@/convex/_generated/api');
const client = new ConvexHttpClient(process.env["CONVEX_URL"]);

export async function POST(request: Request) {
  const data = await request.json();
  const words = data.words;
  words.forEach(async (word: { word: string, category: string}) => { 
    client.mutation(api.words.insert, { word: word.word, category: word.category });
  })
  return new Response('ok', { status: 200 });
}
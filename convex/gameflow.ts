import { v } from "convex/values"
import { query, mutation } from "./_generated/server";
import { GameContext, gameMachine } from '../lib/state/gameMachine';

function shuffleAndSliceArray(array: any[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 25);
}

export interface WordInterface {
  category: string;
  word: string;
  _creationTime: number;
  _id: string;
}

function getColorAndTeam(index: number, redStartCards: number) {
  if (index < redStartCards) {
    return { color: "bg-red-700", team: "red" };
  }
  if (index < 17) {
    return { color: "bg-blue-700", team: "blue" };
  }
  if (index < 18) {
    return { color: "bg-black", team: "black" };
  }
  return { color: "bg-neutral", team: "neutral" };
}

export const update = mutation({
  args: { room: v.string(), state: v.string(), machine: v.string() },
  handler: async ( ctx, { room, state, machine }) => {
    const existing = await ctx.db
      .query("gameflow")
      .withIndex("by_room", (q) => q.eq("room", 'lobby'))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { state, machine });
    } 
    await ctx.db.insert("gameflow", {
      machine,
      state,
      room,
    });
  }
});

export const get = query({
  args: { room: v.string() },
  handler: async ( ctx, { room }) => {
    const workflowData = await ctx.db.query('gameflow').withIndex('by_room', (q) => q.eq('room', room)).unique();
    if (!workflowData) return null
    return workflowData;
  }
})

export const post = mutation({
  args: { room: v.string(), state: v.string() },
  handler: async ( ctx, { room, state }) => {
    const workflowData = await ctx.db.query('gameflow').withIndex('by_room', (q) => q.eq('room', room)).unique();

    if (!workflowData) throw new Error('no gameflow machine availables');
    await ctx.db.patch(workflowData._id, { state });
  }
})


export const createGame = mutation({
  args: { room: v.string() },
  handler: async ( ctx, { room }) => {
    const redStartCards = Math.random() > 0.5 ? 9 : 8;

    const words = await ctx.db.query("words").collect();

    const shuffledWords = shuffleAndSliceArray(words).map(
      (word: WordInterface, index: number) => {
        return {
          revealed: false,
          word: word.word,
          ...getColorAndTeam(index, redStartCards)
      }
    });

    const gameWords = Array.from(shuffleAndSliceArray(shuffledWords));

    const context = {
      cards: gameWords,
      clue: '',
      redteamCardsRemaining: redStartCards,
      blueteamCardsRemaining: 17-redStartCards,
    }
    // @ts-ignore
    const machine = gameMachine.withContext(context)

    const existing = await ctx.db
      .query("gameflow")
      .withIndex("by_room", (q) => q.eq("room", room))
      .unique();
    if (existing) {
      await ctx.db.delete(existing?._id)
    }

    await ctx.db.insert("gameflow", {
      machine: JSON.stringify(machine),
      state: JSON.stringify(machine.initialState),
      room,
    });
  }
})
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";

function shuffleAndSliceArray(array: any[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 25);
}

function getColorAndTeam(index: number) {
  if (index < 9) {
    return { color: "bg-red-500", team: "red" };
  }
  if (index < 17) {
    return { color: "bg-blue-500", team: "blue" };
  }
  if (index < 18) {
    return { color: "bg-black", team: "black" };
  }
  return { color: "bg-neutral", team: "neutral" };
}

export const getWords = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("words").collect();
  },
});

export interface WordInterface {
  category: string;
  word: string;
  _creationTime: number;
  _id: string;
}

export const getWordsForGame = query({
  args: {},
  handler: async (ctx) => {
    const words = await ctx.db.query("words").collect();
    const shuffledWords = shuffleAndSliceArray(words).map(
      (word: WordInterface, index: number) => {
        return {
          _id: word._id,
          word: word.word,
          ...getColorAndTeam(index)
      }
    });

    return Array.from(shuffleAndSliceArray(shuffledWords));
  },
});

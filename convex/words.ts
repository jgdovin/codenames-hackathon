import { query } from "./_generated/server";
import { mutation } from "./_generated/server";

export const getWords = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("words").collect();
  },
});



// export const getWordsForGame = query({
//   args: {},
//   handler: async (ctx) => {
//     const redStartCards = Math.random() > 0.5 ? 9 : 8;
//     const words = await ctx.db.query("words").collect();
//     const shuffledWords = shuffleAndSliceArray(words).map(
//       (word: WordInterface, index: number) => {
//         return {
//           _id: word._id,
//           word: word.word,
//           ...getColorAndTeam(index, redStartCards)
//       }
//     });

//     return { words: Array.from(shuffleAndSliceArray(shuffledWords)), redStartCards };
//   },
// });

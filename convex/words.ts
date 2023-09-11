import { query } from "./_generated/server";
import { mutation } from "./_generated/server";

export const getWords = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("words").collect();
  },
});


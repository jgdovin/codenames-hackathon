import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values"

export const joinRoom = mutation({
  args: {roomId: v.string()},
  handler: async (ctx) => {
    return await ctx.db.query("words").collect();
  },
});


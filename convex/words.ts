import { v } from "convex/values"
import { query, mutation } from "./_generated/server";

export const insert = mutation({
  args: { word: v.string(), category: v.string()},
  handler: async ( ctx, { word, category }) => {
    await ctx.db.insert("words", {
      word,
      category
    });
  }
});
import { v } from "convex/values"
import { query, mutation } from "./_generated/server";

export const update = mutation({
  args: { room: v.string(), state: v.string(), machine: v.string() },
  handler: async ( ctx, { room, state, machine }) => {
    console.log('updating')
    const existing = await ctx.db
      .query("gameflow")
      .withIndex("by_room", (q) => q.eq("room", 'lobby'))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { state, machine });
    } else {
      await ctx.db.insert("gameflow", {
        machine,
        state,
        room,
      });

    }
  }
});

export const get = query({
  args: { room: v.string() },
  handler: async ( ctx, { room }) => {
    const workflowData = await ctx.db.query('gameflow').withIndex('by_room', (q) => q.eq('room', room)).unique();
    if (!workflowData) throw new Error('no gameflow machine available');
    return workflowData;
  }
})

export const post = mutation({
  args: { room: v.string(), state: v.string() },
  handler: async ( ctx, { room, state }) => {
    const workflowData = await ctx.db.query('gameflow').withIndex('by_room', (q) => q.eq('room', room)).unique();
    if (!workflowData) throw new Error('no gameflow machine available');
    await ctx.db.patch(workflowData._id, { state });
  }
})
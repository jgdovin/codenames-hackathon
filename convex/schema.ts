import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  presence: defineTable({
    user: v.string(),
    room: v.string(),
    updated: v.number(),
    data: v.any(),
  })
    // Index for fetching presence data
    .index('by_room_updated', ['room', 'updated'])
    // Index for updating presence data
    .index('by_user_room', ['user', 'room']),
  words: defineTable({
    category: v.string(),
    word: v.string(),
  }),
  rooms: defineTable({
    id: v.string(),
    teams: v.array(v.array(v.string())),
    spymasters: v.array(v.string()),
  }),
  gameflow: defineTable({
    state: v.string(),
    room: v.string(),
  })
  .index('by_room', ['room']),
});
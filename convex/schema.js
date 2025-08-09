import { defineTable, defineSchema } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    imageUrl: v.optional(v.string()),

    plan: v.union(v.literal("free"), v.literal("pro")),

    // Usage tracking for limits
    projectsUsed: v.number(),
    exportsThisMonth: v.number(),

    createdAt: v.optional(v.number()),
    lastActiveAt: v.optional(v.number()),
  })
  .index("by_token", ["tokenIdentifier"])
  .index("by_email", ["email"])
  .searchIndex("search_name", { searchField: "name" })
  .searchIndex("search_email", { searchField: "email" }),
  

  projects: defineTable({
    // basic info
    title: v.string(),
    userId: v.id("users"),

    // canvas dimensions
    canvasState: v.any(),
    width: v.number(),
    height: v.number(),

    // image pipeline
    originalImageUrl: v.optional(v.string()),
    currentImageUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),

    activeTransformations: v.optional(v.string()), // current imagekit URL parameters

    backgroundRemoved: v.optional(v.boolean()),

    // organization
    folderId: v.optional(v.id("folders")),

    // timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_user_updated", ["userId", "updatedAt"])
  .index("by_folder", ["folderId"]),


  folders: defineTable({
    name: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
});

/*
 plan limits 
 free: 3 projects, 20 exports per month, no AI features
 pro: unlimited projects, unlimited exports per month, all AI features
 */
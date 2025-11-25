import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    color: v.string(),
    isFavorite: v.boolean(),
    order: v.number(),
    showCompletedTasks: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creation", ["createdAt"])
    .index("by_order", ["order"]),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("completed")),
    priority: v.union(
      v.literal("p1"),
      v.literal("p2"),
      v.literal("p3"),
      v.literal("p4")
    ),
    projectId: v.id("projects"),
    dueDate: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    labels: v.optional(v.array(v.id("labels"))),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_status", ["status"])
    .index("by_due_date", ["dueDate"])
    .index("by_order", ["order"]),

  labels: defineTable({
    name: v.string(),
    color: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creation", ["createdAt"]),
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Spread auth tables (users, authSessions, authAccounts, authVerificationCodes)
  ...authTables,

  // Extend users table with custom fields
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // Custom field for onboarding flow
    onboardingCompleted: v.optional(v.boolean()),
  }).index("email", ["email"]),

  projects: defineTable({
    name: v.string(),
    color: v.string(),
    isFavorite: v.boolean(),
    order: v.number(),
    showCompletedTasks: v.optional(v.boolean()),
    userId: v.optional(v.id("users")), // Optional during migration
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creation", ["createdAt"])
    .index("by_order", ["order"])
    .index("by_user", ["userId"]),

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
    userId: v.optional(v.id("users")), // Optional during migration
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
    .index("by_order", ["order"])
    .index("by_user", ["userId"])
    .index("by_user_and_project", ["userId", "projectId"]),

  labels: defineTable({
    name: v.string(),
    color: v.string(),
    userId: v.optional(v.id("users")), // Optional during migration
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creation", ["createdAt"])
    .index("by_user", ["userId"]),

  chatSessions: defineTable({
    userId: v.optional(v.id("users")), // Changed from v.string() to v.id("users")
    title: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creation", ["createdAt"])
    .index("by_user", ["userId"]),

  chatMessages: defineTable({
    sessionId: v.id("chatSessions"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
    toolCalls: v.optional(
      v.array(
        v.object({
          name: v.string(),
          arguments: v.string(),
          result: v.optional(v.string()),
        })
      )
    ),
    createdAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_creation", ["createdAt"]),
});

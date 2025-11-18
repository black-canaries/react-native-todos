import { internalMutation } from "./_generated/server";

/**
 * Seed the database with initial test data
 *
 * This follows the official Convex recommended pattern:
 * - Uses internalMutation for security (prevents client-side calls)
 * - Idempotent (safe to run multiple times)
 * - Run via CLI: pnpm convex run init
 *
 * Reference: https://stack.convex.dev/seeding-data-for-preview-deployments
 */
export const init = internalMutation({
  handler: async (ctx) => {
    // Check if data already exists (idempotent)
    const existingProjects = await ctx.db.query("projects").collect();
    if (existingProjects.length > 0) {
      console.log("✓ Database already seeded, skipping initialization");
      return { success: true, message: "Database already seeded" };
    }

    try {
      console.log("Seeding database with initial data...");

      // Create labels
      const labels = await Promise.all([
        ctx.db.insert("labels", {
          name: "Work",
          color: "#4073ff",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("labels", {
          name: "Personal",
          color: "#25b84c",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("labels", {
          name: "Urgent",
          color: "#de4c4a",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("labels", {
          name: "Waiting",
          color: "#ffa900",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("labels", {
          name: "Home",
          color: "#884dff",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("labels", {
          name: "Shopping",
          color: "#ff40a6",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
      ]);

      // Create projects
      const projects = await Promise.all([
        ctx.db.insert("projects", {
          name: "Inbox",
          color: "#4073ff",
          isFavorite: true,
          order: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("projects", {
          name: "Work Projects",
          color: "#de4c4a",
          isFavorite: true,
          order: 1,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("projects", {
          name: "Personal Goals",
          color: "#25b84c",
          isFavorite: true,
          order: 2,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("projects", {
          name: "Shopping List",
          color: "#ffa900",
          isFavorite: false,
          order: 3,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("projects", {
          name: "Home Improvement",
          color: "#884dff",
          isFavorite: false,
          order: 4,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("projects", {
          name: "Learning & Development",
          color: "#ff8d00",
          isFavorite: false,
          order: 5,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
      ]);

      // Create tasks
      const today = Date.now();
      const tomorrow = today + 24 * 60 * 60 * 1000;
      const nextWeek = today + 7 * 24 * 60 * 60 * 1000;
      const yesterday = today - 24 * 60 * 60 * 1000;

      await Promise.all([
        // Inbox tasks
        ctx.db.insert("tasks", {
          title: "Review quarterly report",
          description: "Go through Q4 financials and prepare summary",
          status: "active",
          priority: "p1",
          projectId: projects[0],
          dueDate: today,
          labels: [labels[0], labels[2]],
          order: 0,
          createdAt: yesterday,
          updatedAt: Date.now(),
        }),
        ctx.db.insert("tasks", {
          title: "Call dentist for appointment",
          status: "active",
          priority: "p2",
          projectId: projects[0],
          dueDate: today,
          labels: [labels[1]],
          order: 1,
          createdAt: yesterday,
          updatedAt: Date.now(),
        }),
        ctx.db.insert("tasks", {
          title: "Buy birthday gift for mom",
          status: "active",
          priority: "p2",
          projectId: projects[0],
          dueDate: tomorrow,
          labels: [labels[1], labels[5]],
          order: 2,
          createdAt: today,
          updatedAt: Date.now(),
        }),

        // Work Projects tasks
        ctx.db.insert("tasks", {
          title: "Design new feature mockups",
          description: "Create wireframes and high-fidelity designs for the new dashboard",
          status: "active",
          priority: "p1",
          projectId: projects[1],
          dueDate: tomorrow,
          labels: [labels[0]],
          order: 0,
          createdAt: yesterday,
          updatedAt: Date.now(),
        }),
        ctx.db.insert("tasks", {
          title: "Update API documentation",
          status: "active",
          priority: "p3",
          projectId: projects[1],
          dueDate: nextWeek,
          labels: [labels[0]],
          order: 1,
          createdAt: yesterday,
          updatedAt: Date.now(),
        }),
        ctx.db.insert("tasks", {
          title: "Code review for PR #234",
          status: "active",
          priority: "p2",
          projectId: projects[1],
          dueDate: today,
          labels: [labels[0]],
          order: 2,
          createdAt: today,
          updatedAt: Date.now(),
        }),
        ctx.db.insert("tasks", {
          title: "Deploy staging environment",
          status: "completed",
          priority: "p1",
          projectId: projects[1],
          labels: [labels[0]],
          order: 3,
          createdAt: yesterday,
          updatedAt: Date.now(),
        }),

        // Personal Goals tasks
        ctx.db.insert("tasks", {
          title: "Run 3 times per week",
          description: "Maintain fitness routine",
          status: "active",
          priority: "p2",
          projectId: projects[2],
          labels: [labels[1]],
          order: 0,
          createdAt: today,
          updatedAt: Date.now(),
        }),
        ctx.db.insert("tasks", {
          title: "Read 2 books this month",
          status: "active",
          priority: "p3",
          projectId: projects[2],
          labels: [labels[1]],
          order: 1,
          createdAt: yesterday,
          updatedAt: Date.now(),
        }),
        ctx.db.insert("tasks", {
          title: "Learn React Native",
          description: "Complete online course and build sample app",
          status: "active",
          priority: "p2",
          projectId: projects[2],
          dueDate: nextWeek,
          labels: [labels[1]],
          order: 2,
          createdAt: yesterday,
          updatedAt: Date.now(),
        }),

        // Shopping List tasks
        ctx.db.insert("tasks", {
          title: "Milk",
          status: "active",
          priority: "p4",
          projectId: projects[3],
          labels: [labels[5]],
          order: 0,
          createdAt: today,
          updatedAt: Date.now(),
        }),
        ctx.db.insert("tasks", {
          title: "Eggs",
          status: "active",
          priority: "p4",
          projectId: projects[3],
          labels: [labels[5]],
          order: 1,
          createdAt: today,
          updatedAt: Date.now(),
        }),
        ctx.db.insert("tasks", {
          title: "Bread",
          status: "completed",
          priority: "p4",
          projectId: projects[3],
          labels: [labels[5]],
          order: 2,
          createdAt: today,
          updatedAt: Date.now(),
        }),
        ctx.db.insert("tasks", {
          title: "Paper towels",
          status: "active",
          priority: "p4",
          projectId: projects[3],
          labels: [labels[5]],
          order: 3,
          createdAt: today,
          updatedAt: Date.now(),
        }),

        // Home Improvement tasks
        ctx.db.insert("tasks", {
          title: "Fix leaky faucet",
          status: "active",
          priority: "p1",
          projectId: projects[4],
          dueDate: tomorrow,
          labels: [labels[4]],
          order: 0,
          createdAt: yesterday,
          updatedAt: Date.now(),
        }),
        ctx.db.insert("tasks", {
          title: "Paint bedroom walls",
          status: "active",
          priority: "p3",
          projectId: projects[4],
          labels: [labels[4]],
          order: 1,
          createdAt: yesterday,
          updatedAt: Date.now(),
        }),

        // Learning & Development tasks
        ctx.db.insert("tasks", {
          title: "Complete TypeScript course",
          status: "active",
          priority: "p2",
          projectId: projects[5],
          dueDate: nextWeek,
          labels: [labels[1]],
          order: 0,
          createdAt: yesterday,
          updatedAt: Date.now(),
        }),
        ctx.db.insert("tasks", {
          title: "Watch React Native conference talk",
          status: "completed",
          priority: "p3",
          projectId: projects[5],
          labels: [labels[1]],
          order: 1,
          createdAt: yesterday,
          updatedAt: Date.now(),
        }),
      ]);

      console.log("✓ Database seeded successfully with 6 projects, 18+ tasks, and 6 labels");
      return { success: true, message: "Database seeded successfully" };
    } catch (error) {
      console.error("✗ Error seeding database:", error);
      return { success: false, message: `Error seeding database: ${error}` };
    }
  },
});

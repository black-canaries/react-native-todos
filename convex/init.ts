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

      // Create or get demo user
      const DEMO_EMAIL = "hello@iamjonathan.me";
      let demoUser = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", DEMO_EMAIL))
        .first();

      if (!demoUser) {
        console.log(`Creating demo user: ${DEMO_EMAIL}`);
        const demoUserId = await ctx.db.insert("users", {
          email: DEMO_EMAIL,
          onboardingCompleted: true,
        });
        demoUser = await ctx.db.get(demoUserId);
        console.log(`✓ Demo user created with ID: ${demoUserId}`);
      } else {
        console.log(`✓ Demo user already exists: ${demoUser._id}`);
      }

      if (!demoUser) {
        throw new Error("Failed to create demo user");
      }

      const userId = demoUser._id;

      // Create labels
      const labels = await Promise.all([
        ctx.db.insert("labels", {
          name: "Work",
          color: "#4073ff",
          userId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("labels", {
          name: "Personal",
          color: "#25b84c",
          userId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("labels", {
          name: "Urgent",
          color: "#de4c4a",
          userId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("labels", {
          name: "Waiting",
          color: "#ffa900",
          userId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("labels", {
          name: "Home",
          color: "#884dff",
          userId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("labels", {
          name: "Shopping",
          color: "#ff40a6",
          userId,
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
          userId,
          order: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("projects", {
          name: "Work Projects",
          color: "#de4c4a",
          isFavorite: true,
          userId,
          order: 1,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("projects", {
          name: "Personal Goals",
          color: "#25b84c",
          isFavorite: true,
          userId,
          order: 2,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("projects", {
          name: "Shopping List",
          color: "#ffa900",
          isFavorite: false,
          userId,
          order: 3,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("projects", {
          name: "Home Improvement",
          color: "#884dff",
          isFavorite: false,
          userId,
          order: 4,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
        ctx.db.insert("projects", {
          name: "Learning & Development",
          color: "#ff8d00",
          isFavorite: false,
          userId,
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
          userId,
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
          userId,
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
          userId,
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
          userId,
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
          userId,
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
          userId,
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
          userId,
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
          userId,
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
          userId,
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
          userId,
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
          userId,
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
          userId,
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
          userId,
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
          userId,
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
          userId,
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
          userId,
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
          userId,
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
          userId,
          labels: [labels[1]],
          order: 1,
          createdAt: yesterday,
          updatedAt: Date.now(),
        }),
      ]);

      console.log("✓ Database seeded successfully with demo user, 6 projects, 18+ tasks, and 6 labels");
      console.log(`✓ Demo user can log in via OTP to: ${DEMO_EMAIL}`);
      return {
        success: true,
        message: "Database seeded successfully",
        demoEmail: DEMO_EMAIL,
      };
    } catch (error) {
      console.error("✗ Error seeding database:", error);
      return { success: false, message: `Error seeding database: ${error}` };
    }
  },
});

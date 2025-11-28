import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Query to get the current user's profile including onboarding status
 */
export const getCurrentUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    return user;
  },
});

/**
 * Mutation to mark onboarding as completed for the current user
 */
export const completeOnboarding = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(userId, {
      onboardingCompleted: true,
    });

    return { success: true };
  },
});

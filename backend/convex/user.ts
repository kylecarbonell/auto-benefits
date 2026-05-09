import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const ensureUserFromClerk = internalMutation({
	args: {
		clerkId: v.string(),
		email: v.string(),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
			.unique();

		if (existing) {
			return existing._id;
    }

    const userId = await ctx.db.insert("users", {
			clerkId: args.clerkId,
			email: args.email,
			name: args.name,
    });

    await ctx.db.insert("profiles", {
      userId: userId
    })

		return userId
	},
});

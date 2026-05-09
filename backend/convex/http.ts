import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
	path: "/",
	method: "GET",
	handler: httpAction(async (_ctx, request) => {
		return new Response(`Hello from poopoo ${request.url}`);
	}),
});

http.route({
	path: "/clerk-webhook",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const payload = await request.json();

		if (payload.type === "user.created") {
			const user = payload.data;

			const primaryEmail =
				user.email_addresses?.find(
					(email: { id: string; email_address: string }) =>
						email.id === user.primary_email_address_id
				)?.email_address ?? "";

			const name =
				[user.first_name, user.last_name].filter(Boolean).join(" ").trim() || "Unknown User";

			await ctx.runMutation(internal.user.ensureUserFromClerk, {
				clerkId: user.id,
				email: primaryEmail,
				name,
			});
		}

		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { "content-type": "application/json" },
		});
	}),
});

export default http;

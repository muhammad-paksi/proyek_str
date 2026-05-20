
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "@/auth";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
		// This runs when any action throws an unexpected error
		console.error("Action error:", e.message);
		// What you return here becomes result.serverError on the client
		// Default: "Something went wrong"
		return {
			status: 412,
			message: `I'm a teapot`,
			error: e.message
		}
	},
	defaultValidationErrorsShape: "flattened",
});

export const authClient = actionClient
	.use(async ({ next }) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) redirect("/account/signin");
		return next({ 
			ctx: { user: session.user } 
		});
	});
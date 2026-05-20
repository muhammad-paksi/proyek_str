"use server";

import * as v from "valibot";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { actionClient } from "@/server/safe-action";
import { returnValidationErrors } from "next-safe-action";

const signinSchema = v.object({
  email: v.pipe(
    v.string("Email is required"),
    v.rfcEmail()
  ),
  password: v.pipe(
    v.string("Password is required"),
    v.minLength(6, "Password must be at least 6 characters long")
  ),
  rememberMe: v.optional(v.boolean(), false),
});

export const signIn = actionClient
  .inputSchema(signinSchema)
  .action(async ({ ctx, parsedInput }) => {
    console.log("Input:", parsedInput);

    const session = await auth.api.signInEmail({
      body: parsedInput,
      headers: await headers(),
      returnHeaders: true,
      returnStatus: true,
    });

    if (!session) return returnValidationErrors(signinSchema, {
      _errors: ["Invalid email or password"],
    });
    
    return { user: session.response.user }
  });

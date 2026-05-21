"use server";

import * as v from "valibot";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { actionClient } from "@/server/safe-action";
import { returnValidationErrors } from "next-safe-action";

const signupSchema = v.object({
  email: v.pipe(v.string("Email is required"), v.rfcEmail()),
  password: v.pipe(v.string("Password is required"), v.minLength(6, "Password must be at least 6 characters long")),
})

export const signUp = actionClient
  .inputSchema(signupSchema)
  .action(async ({ ctx, parsedInput }) => {
    console.log("Input:", parsedInput);

    const session = await auth.api.signUpEmail({
      body: {
        name: parsedInput.email,
        ...parsedInput
      },
      headers: await headers(),
      returnHeaders: true,
      returnStatus: true,
    });

    if (!session.response.token) {
      return returnValidationErrors(signupSchema, {
        _errors: ["Signup fails, try again later"]
      })
    }

    return { user: session.response.user }
  });

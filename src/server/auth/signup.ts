"use server";

import * as v from "valibot";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { actionClient } from "@/server/safe-action";

export const signUp = actionClient
  .inputSchema(
    v.object({
      email: v.pipe(v.string("Email is required"), v.rfcEmail()),
      password: v.pipe(v.string("Password is required"), v.minLength(6, "Password must be at least 6 characters long")),
    })
  )
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

    return session ? {
      // ok: true,
      status: 201,
      message: "Sign up successful",
      user: session.response.user
    }: {
      // ok: false,
      status: 401,
      message: "Invalid email or password",
      user: null
    }
  });

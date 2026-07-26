"use server";

import * as v from "valibot";
import { cookies } from "next/headers";
import { actionClient } from "@/server/safe-action";
import { returnValidationErrors } from "next-safe-action";
import { db } from "@/database/conn";
import { user, role } from "@/database/schemas/jadwal.schema";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose";

const signinSchema = v.object({
  username: v.pipe(
    v.string("Username is required"),
  ),
  password: v.pipe(
    v.string("Password is required"),
  ),
  rememberMe: v.optional(v.boolean(), false),
});

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super_secret_key_12345"
);

export const signIn = actionClient
  .inputSchema(signinSchema)
  .action(async ({ parsedInput }) => {
    const { username, password } = parsedInput;

    const dbUser = await db.select().from(user).where(eq(user.username, username)).limit(1);

    if (dbUser.length === 0 || dbUser[0].password !== password) {
      return returnValidationErrors(signinSchema, {
        _errors: ["Invalid username or password"],
      });
    }

    const userRole = await db.select().from(role).where(eq(role.username, username)).limit(1);
    const roleName = userRole.length > 0 ? userRole[0].role : "mahasiswa";

    const token = await new SignJWT({
      username: dbUser[0].username,
      role: roleName,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(parsedInput.rememberMe ? "30d" : "1d")
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: parsedInput.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
      path: "/",
    });

    return { user: { username: dbUser[0].username, role: roleName } };
  });

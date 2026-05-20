import { betterAuth } from "better-auth";
import { bearer, username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/database/conn"; // drizzle instance
import * as schema from "@/database/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),

  basePath: "/auth/better-auth",
  trustedOrigins: [
    // Server frontend
    "http://localhost:4001",
  ],

  advanced: {
    // useSecureCookies: true,
    crossSubDomainCookies: {
      enabled: true,
      domain: "localhost", // your domain
    },
  },

  cookie: {
    // JANGAN masukkan port di sini!
    // Cukup "localhost" saja.
    domain: "localhost", // Sesuaikan dengan domain FE
    sameSite: "Lax", // Gunakan "Lax" untuk localhost, atau "None" + Secure: true untuk beda domain
    httpOnly: true,
    secure: false, // Karena localhost biasanya HTTP bukan HTTPS
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 * 2, // 2 days (every 2 days the session expiration is updated)
    freshAge: 60 * 5, // 5 minutes (the session is fresh if created within the last 5 minutes)
  },

  //...other options
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
    password: {
      // Custom password hashing and verification (optional)

    },
    minPasswordLength: 6,
  },
  plugins: [
    bearer(),
    username(),
    nextCookies(), // make sure this is the last plugin in the array
  ],
});
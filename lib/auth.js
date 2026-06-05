import dotenv from 'dotenv';
dotenv.config();

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { dash } from "@better-auth/infra";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);
await client.connect();

const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  basePath: "/api/auth",

  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://pet-adoption-client-eta.vercel.app",
    "https://pet-adoption-client.vercel.app",
    "https://pet-adoption-client-cw7p2th9p-imran-385s-projects.vercel.app",
    "https://pet-adoption-client-git-main-imran-385s-projects.vercel.app",
  ],

  account: {
    storeStateStrategy: "cookie",
  },

  advanced: {
    useSecureCookies: true,
    disableCSRFCheck: true,
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },
  plugins: [
    dash()
  ]
}); // nodemon restart trigger
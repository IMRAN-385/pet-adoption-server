import dotenv from 'dotenv';
dotenv.config();

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);
await client.connect();

const db = client.db();

export const auth = betterAuth({
  baseURL: "https://pet-adoption-server-uipt.onrender.com",
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
      // REMOVED: allowDangerousEmailAccountLinking (This is NextAuth syntax)
    },
  },

  // FIX 1: This is how Better Auth natively links duplicate provider emails
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"], 
    },
    // Keep your strategy if you prefer database-side persistence
    storeStateStrategy: "database",
  },

  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://vercel.app",
    "https://vercel.app",
    "https://vercel.app",
    "https://vercel.app",
  ],

  advanced: {
    useSecureCookies: true,
    // FIX 2: Re-enable core security checks once configuration is proper
    disableCSRFCheck: false, 
    disableOriginCheck: false,
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },
});

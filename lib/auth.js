import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
const db = client.db();

export const auth = betterAuth({
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
    storeStateStrategy: "database",
  },

  advanced: {
    useSecureCookies: true,
    disableCSRFCheck: true,
  },
});
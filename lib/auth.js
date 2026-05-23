import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),

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
  ],

  // Session cookie config (production-safe)
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});
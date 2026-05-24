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

  advanced: {import { betterAuth } from "better-auth";
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
      clientId: process.env.74299014057-q04tf3f734vptvio9c2bf20p91o6tmja.apps.googleusercontent.com,
      clientSecret: process.env.****-cy5,
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

  // ✅ State database এ store করবে, cookie তে না
  account: {
    storeStateStrategy: "database",
  },

  advanced: {
    useSecureCookies: true,
    disableCSRFCheck: true,
  },
}),
    useSecureCookies: true,
    disableCSRFCheck: true,
    crossSubDomainCookies: {
      enabled: false,
    },
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
        },
      },
    },
  },
});
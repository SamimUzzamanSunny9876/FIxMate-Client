import { betterAuth } from "better-auth";
import { Db, MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin } from "better-auth/plugins";

const uri = process.env.BETTER_AUTH_DB_URI as string;

const globalForMongo = globalThis as unknown as {
  betterAuthMongoClient?: MongoClient;
  betterAuthDbPromise?: Promise<Db>;
};

const client =
  globalForMongo.betterAuthMongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

globalForMongo.betterAuthMongoClient = client;

async function getConnectedDb(): Promise<Db> {
  if (!globalForMongo.betterAuthDbPromise) {
    globalForMongo.betterAuthDbPromise = client
      .connect()
      .then((connected) => connected.db("FixMatedb"))
      .catch((err) => {
        globalForMongo.betterAuthDbPromise = undefined;
        throw err;
      });
  }

  try {
    await client.db("admin").command({ ping: 1 });
    return await globalForMongo.betterAuthDbPromise;
  } catch {
    globalForMongo.betterAuthDbPromise = client
      .connect()
      .then((connected) => connected.db("FixMatedb"))
      .catch((err) => {
        globalForMongo.betterAuthDbPromise = undefined;
        throw err;
      });
    return await globalForMongo.betterAuthDbPromise;
  }
}

const db = await getConnectedDb();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    "http://localhost:3000",
    "https://fix-mate-client-sepia.vercel.app",
    "https://*.vercel.app",
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      signupRole: {
        type: "string",
        required: false,
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      area: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      bio: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requestedRole = (user as Record<string, unknown>).signupRole;
          const allowedSignupRoles = ["customer", "technician"];
          const safeRole =
            typeof requestedRole === "string" &&
            allowedSignupRoles.includes(requestedRole)
              ? requestedRole
              : "customer";

          const cleanUser = { ...user } as Record<string, unknown>;
          delete cleanUser.signupRole;

          return {
            data: {
              ...cleanUser,
              role: safeRole,
            },
          };
        },
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    admin({
      defaultRole: "customer",
    }),
  ],
  database: mongodbAdapter(db, {
    client,
  }),
});
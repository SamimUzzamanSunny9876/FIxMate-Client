import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string);
const db = client.db("FixMatedb");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
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
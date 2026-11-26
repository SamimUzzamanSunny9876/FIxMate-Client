// lib/mongodb.ts (or lib/db.ts)
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const globalWithMongo = global as typeof globalThis & {
  _mongoClient?: MongoClient;
  _mongoClientPromise?: Promise<MongoClient>;
};

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = globalWithMongo._mongoClient.connect();
  }
  client = globalWithMongo._mongoClient;
  clientPromise = globalWithMongo._mongoClientPromise!;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export const db = client.db(); // Pass this `db` into mongodbAdapter(db) in lib/auth.ts
export default clientPromise;

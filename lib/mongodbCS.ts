import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_CS!;
if (!uri) {
  throw new Error("Please define the MONGODB_URL environment variable in .env");
}

let cached = (global as any)._mongo as {
  client?: MongoClient;
  db?: Db;
};

if (!cached) {
  cached = (global as any)._mongo = {};
}

export async function getDB(): Promise<Db> {
  if (!cached.client) {
    const client = new MongoClient(uri, {
      // Add any options here, e.g. useUnifiedTopology: true
    });
    await client.connect();
    const db = client.db("gitfullDb");
    cached.client = client;
    cached.db = db;
  }
  return cached.db!;
}


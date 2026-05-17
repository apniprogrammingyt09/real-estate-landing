import { MongoClient } from "mongodb"
import { env } from "./env"

if (!env.MONGODB_URI && typeof window === "undefined") {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = env.MONGODB_URI || ""
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

export const getDatabase = async () => {
  const client = await clientPromise
  return client.db(env.MONGODB_DB)
}

// Legacy export for backward compatibility
export const connectToDatabase = async () => {
  const client = await clientPromise
  const db = client.db(env.MONGODB_DB)
  return { client, db }
}

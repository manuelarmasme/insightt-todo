import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (!process.env.MONGODB_DB_NAME) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_DB_NAME"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Use a global variable to preserve the connection across hot-reloads in development
// This prevents connection exhaustion in serverless environments
declare global {
   
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so the connection
  // is preserved across hot-reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client for each connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise
// By doing this in a separate module, the client can be shared across functions
export default clientPromise;

// Helper function to get database instance
export async function getDatabase() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB_NAME);
}
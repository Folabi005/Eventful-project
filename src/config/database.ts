import { Db, MongoClient } from 'mongodb';
import { env } from './env';

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;

export async function connectMongo(): Promise<Db | null> {
  if (!env.mongodbUri) {
    console.warn('MONGODB_URI is not configured; using in-memory fallback mode.');
    return null;
  }

  try {
    if (!mongoClient) {
      mongoClient = new MongoClient(env.mongodbUri);
      await mongoClient.connect();
    }

    mongoDb = mongoClient.db(env.mongodbDbName);
    return mongoDb;
  } catch (error) {
    console.warn('MongoDB connection failed, falling back to in-memory repository mode:', error);
    mongoClient = null;
    mongoDb = null;
    return null;
  }
}

export function getMongoDb(): Db | null {
  return mongoDb;
}

export async function disconnectMongo(): Promise<void> {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
    mongoDb = null;
  }
}

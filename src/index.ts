import app from './app';
import { connectMongo } from './config/database';
import { env } from './config/env';

async function start() {
  const db = await connectMongo();
  if (db) {
    console.log(`MongoDB connected: ${env.mongodbDbName}`);
  } else {
    console.log('MongoDB not configured; using in-memory repository fallback.');
  }

  app.listen(env.port, env.host, () => {
    // eslint-disable-next-line no-console
    console.log(`Eventful API listening on http://${env.host}:${env.port}`);
  });
}

start();

import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

export const env = {
  port: Number(process.env.PORT || 5000),
  host: process.env.HOST || '0.0.0.0',
  jwtSecret: process.env.JWT_SECRET || 'eventful-dev-secret',
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || '',
  paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
  mongodbUri: process.env.MONGODB_URI || '',
  mongodbDbName: process.env.MONGODB_DB_NAME || 'eventful',
  redisUrl: process.env.UPSTASH_REDIS_REST_URL || '',
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  nodeEnv,
  isProduction: nodeEnv === 'production',
};

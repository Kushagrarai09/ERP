import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validate critical environment variables
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

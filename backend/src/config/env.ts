import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'development-only-change-this-secret';
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required in production');
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validate critical environment variables
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

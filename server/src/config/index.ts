import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_portfolios',
  jwtSecret: process.env.JWT_SECRET || 'focus_engineering_super_secure_jwt_secret_key_2026_xyz',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieName: process.env.COOKIE_NAME || 'focus_admin_token',
  cookieSecure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  canonicalSiteUrl: process.env.CANONICAL_SITE_URL || 'http://localhost:5173',
  initialAdmin: {
    email: process.env.INITIAL_ADMIN_EMAIL || 'admin@focusengineering.com',
    password: process.env.INITIAL_ADMIN_PASSWORD || 'AdminSecure2026!',
    name: process.env.INITIAL_ADMIN_NAME || 'FOCUS System Administrator'
  }
};

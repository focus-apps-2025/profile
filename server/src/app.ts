import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import apiRoutes from './routes';
import { errorHandler } from './middleware/error';
import { config } from './config';

const app: Application = express();

// ✅ CRITICAL — Render terminates TLS at a proxy.
//    Without this, Express sees requests as HTTP → secure cookies get rejected.
app.set('trust proxy', 1);

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ✅ CORS — strict allow-list with credentials support
const allowedOrigins = [
  config.clientUrl,                                    // env: production → profile.focusengineeringapp.com
  config.canonicalSiteUrl,                             // env: production → profile.focusengineeringapp.com
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://portfolio.focusengineeringapp.com',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // In development, be permissive. In production, deny.
      if (!config.isProduction) {
        return callback(null, true);
      }

      // Production: reject unlisted origins
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// Serve uploaded static files
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// ✅ Health check — used by Render's Health Check Path
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    environment: config.nodeEnv,          // ← visible proof that env vars loaded
    isProduction: config.isProduction,
    cookieSecure: config.cookieSecure,
    cookieSameSite: config.cookieSameSite,
    timestamp: new Date().toISOString(),
    service: 'focus-portfolio-backend',
    version: '1.0.0',
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    service: 'focus-portfolio-backend',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/v1', apiRoutes);

// Fallback for API routes (404)
app.all('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found.',
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
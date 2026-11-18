import app from './app';
import { config } from './config';
import { connectDB } from './config/db';
import { seedDatabase } from './services/seed';

const startServer = async () => {
  try {
    console.log('[Server] Connecting to MongoDB...');
    const dbConnected = await connectDB();

    if (dbConnected) {
      // Auto-seed admin and sample portfolios if empty
      await seedDatabase();
    } else {
      console.log('[Server] Operating with In-Memory storage. All public and admin endpoints are fully active.');
    }

    const server = app.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(`  FOCUS Engineering Portfolio API Server`);
      console.log(`  Environment : ${config.nodeEnv}`);
      console.log(`  URL         : http://localhost:${config.port}`);
      console.log(`  API Root    : http://localhost:${config.port}/api/v1`);
      console.log(`  Health Check: http://localhost:${config.port}/health`);
      console.log(`====================================================`);
    });

    // Graceful shutdown handling
    const shutdown = (signal: string) => {
      console.log(`\n[Server] Received ${signal}. Closing HTTP server gracefully...`);
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error: any) {
    console.error(`[Server] Fatal startup error: ${error.message}`);
    process.exit(1);
  }
};

startServer();

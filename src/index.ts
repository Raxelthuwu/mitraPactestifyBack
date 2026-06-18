import { createServer } from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

console.log('[Server] Configuration:', {
  port: PORT,
  environment: NODE_ENV,
});

const start = async (): Promise<void> => {
  try {
    console.log('[Server] Starting initialization');

    await connectDB();

    console.log('[Server] Database connection ready');

    const server = createServer(app);

    server.listen(PORT, () => {
      console.log('[Server] Listening:', {
        port: PORT,
        environment: NODE_ENV,
      });
    });

    const gracefulShutdown = async (): Promise<void> => {
      console.log('[Server] Shutdown requested');

      server.close(() => {
        console.log('[Server] Closed successfully');
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  } catch (err) {
    console.error('[Server] Initialization error:', err);
    process.exit(1);
  }
};

start();
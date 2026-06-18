import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? [];

console.log('[App] Environment:', process.env.NODE_ENV);
console.log('[App] Allowed origins:', allowedOrigins);

app.use(helmet());

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  const response = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };

  console.log('[GET /health] Request received');
  console.log('[GET /health] Response:', response);

  res.json(response);
});

export default app;
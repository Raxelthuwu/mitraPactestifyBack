import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

console.log('[Database] Configuration:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '[HIDDEN]' : '[NOT_SET]',
});

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export const connectDB = async (): Promise<void> => {
  console.log('[Database.connectDB] Starting connection test');

  try {
    const client = await pool.connect();

    console.log('[Database.connectDB] Connection successful');

    client.release();

    console.log('[Database.connectDB] Client released');
    console.log('[Database.connectDB] Return: void');
  } catch (error) {
    console.error('[Database.connectDB] Connection error:', error);
    process.exit(1);
  }
};
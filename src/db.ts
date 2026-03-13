import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load .env values (webpack already loads it for the frontend, but we also want it here)
dotenv.config();

export const pool = new Pool({
  host: process.env.PGHOST ?? 'localhost',
  port: Number(process.env.PGPORT ?? 5432),
  user: process.env.PGUSER ?? 'postgres',
  password: process.env.PGPASSWORD ?? 'pgpwd4habr',
  database: process.env.PGDATABASE ?? 'postgres',
});

export type DogovorRow = {
  id?: number;
  contract: string;
  counterparty: string;
  sum: string;
  status: string;
  date: string;
};

export async function getDbTime() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW() as now');
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function ensureDogovoryTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS dogovory (
        id SERIAL PRIMARY KEY,
        contract TEXT NOT NULL,
        counterparty TEXT NOT NULL,
        sum TEXT NOT NULL,
        status TEXT NOT NULL,
        date TEXT NOT NULL
      );
    `);
  } finally {
    client.release();
  }
}

export async function getDogovory(): Promise<DogovorRow[]> {
  const client = await pool.connect();
  try {
    const result = await client.query<DogovorRow>('SELECT * FROM dogovory ORDER BY id');
    return result.rows;
  } finally {
    client.release();
  }
}

export async function replaceDogovory(rows: DogovorRow[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM dogovory');

    const insertText = `
      INSERT INTO dogovory (contract, counterparty, sum, status, date)
      VALUES ($1, $2, $3, $4, $5)
    `;

    for (const row of rows) {
      await client.query(insertText, [
        row.contract ?? '',
        row.counterparty ?? '',
        row.sum ?? '',
        row.status ?? '',
        row.date ?? '',
      ]);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

import express from 'express';
import cors from 'cors';
import path from 'path';
import {
  ensureDogovoryTable,
  getDbTime,
  getDogovory,
  replaceDogovory,
  DogovorRow,
} from './db';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

// Allow cross-origin requests (useful when frontend runs on a different port)
app.use(cors());
app.use(express.json());

// A simple backend landing response
app.get('/', (req, res) => {
  res.type('text/plain').send('это бэкенд!');
});

// Serve the SPA static files (same public directory as Webpack dev server)
app.use(express.static(path.join(__dirname, '../public')));

// Quick DB health endpoint
app.get('/api/db-time', async (req, res) => {
  try {
    const time = await getDbTime();
    res.json({ success: true, time });
  } catch (error) {
    console.error('Postgres error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Dogovory CRUD
app.get('/api/dogovory', async (req, res) => {
  try {
    const rows = await getDogovory();
    res.json({ success: true, rows });
  } catch (error) {
    console.error('Dogovory GET error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.put('/api/dogovory', async (req, res) => {
  try {
    const rows = Array.isArray(req.body) ? (req.body as DogovorRow[]) : [];
    await replaceDogovory(rows);
    const saved = await getDogovory();
    res.json({ success: true, rows: saved });
  } catch (error) {
    console.error('Dogovory PUT error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

async function start() {
  await ensureDogovoryTable();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

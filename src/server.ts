import express from 'express';
import cors from 'cors';
import path from 'path';
import {
  ensureDogovoryTable,
  ensureZakupSpravochnikTable,
  getDbTime,
  getDogovory,
  getZakupSpravochnik,
  replaceDogovory,
  replaceZakupSpravochnik,
  DogovorRow,
  ZakupSpravochnikData,
  ensureSuppliersTable,
  ensureCounterpartiesTable,
  ensureContractsDirectoryTable,
  insertInitialSuppliersData,
  insertInitialCounterpartiesData,
  insertInitialContractsDirectoryData,
  getSuppliers,
  getCounterparties,
  getContractsDirectory,
  replaceSuppliers,
  replaceCounterparties,
  replaceContractsDirectory,
  SupplierRow,
  CounterpartyRow,
  ContractDirectoryRow,
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

// Zakup Spravochnik CRUD
app.get('/api/zakup/spravochnik', async (req, res) => {
  try {
    const data = await getZakupSpravochnik();
    res.json({ success: true, ...data });
  } catch (error) {
    console.error('Zakup Spravochnik GET error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.put('/api/zakup/spravochnik', async (req, res) => {
  try {
    const payload = req.body as ZakupSpravochnikData;
    await replaceZakupSpravochnik(payload);
    const saved = await getZakupSpravochnik();
    res.json({ success: true, ...saved });
  } catch (error) {
    console.error('Zakup Spravochnik PUT error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Suppliers CRUD
app.get('/api/suppliers', async (req, res) => {
  try {
    const rows = await getSuppliers();
    res.json({ success: true, rows });
  } catch (error) {
    console.error('Suppliers GET error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.put('/api/suppliers', async (req, res) => {
  try {
    const rows = Array.isArray(req.body) ? (req.body as SupplierRow[]) : [];
    await replaceSuppliers(rows);
    const saved = await getSuppliers();
    res.json({ success: true, rows: saved });
  } catch (error) {
    console.error('Suppliers PUT error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Counterparties CRUD
app.get('/api/counterparties', async (req, res) => {
  try {
    const rows = await getCounterparties();
    res.json({ success: true, rows });
  } catch (error) {
    console.error('Counterparties GET error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.put('/api/counterparties', async (req, res) => {
  try {
    const rows = Array.isArray(req.body) ? (req.body as CounterpartyRow[]) : [];
    await replaceCounterparties(rows);
    const saved = await getCounterparties();
    res.json({ success: true, rows: saved });
  } catch (error) {
    console.error('Counterparties PUT error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Contracts Directory CRUD
app.get('/api/contracts-directory', async (req, res) => {
  try {
    const rows = await getContractsDirectory();
    res.json({ success: true, rows });
  } catch (error) {
    console.error('Contracts Directory GET error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.put('/api/contracts-directory', async (req, res) => {
  try {
    const rows = Array.isArray(req.body) ? (req.body as ContractDirectoryRow[]) : [];
    await replaceContractsDirectory(rows);
    const saved = await getContractsDirectory();
    res.json({ success: true, rows: saved });
  } catch (error) {
    console.error('Contracts Directory PUT error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

async function start() {
  await ensureDogovoryTable();
  await ensureZakupSpravochnikTable();
  await ensureSuppliersTable();
  await ensureCounterpartiesTable();
  await ensureContractsDirectoryTable();

  // Insert initial data if tables are empty
  const suppliers = await getSuppliers();
  if (suppliers.length === 0) {
    await insertInitialSuppliersData();
  }
  const counterparties = await getCounterparties();
  if (counterparties.length === 0) {
    await insertInitialCounterpartiesData();
  }
  const contractsDir = await getContractsDirectory();
  if (contractsDir.length === 0) {
    await insertInitialContractsDirectoryData();
  }

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

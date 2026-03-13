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

export type ZakupSpravochnikData = {
  suppliers: string[];
  counterparties: string[];
  contracts: string[];
};

export async function ensureZakupSpravochnikTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS zakup_spravochnik (
        id SERIAL PRIMARY KEY,
        kind TEXT NOT NULL CHECK (kind IN ('supplier', 'counterparty', 'contract')),
        value TEXT NOT NULL
      );
    `);
  } finally {
    client.release();
  }
}

export async function getZakupSpravochnik(): Promise<ZakupSpravochnikData> {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT kind, value FROM zakup_spravochnik');
    const data: ZakupSpravochnikData = { suppliers: [], counterparties: [], contracts: [] };
    for (const row of result.rows) {
      const kind = (row.kind ?? '').toString();
      const value = (row.value ?? '').toString();
      if (kind === 'supplier') data.suppliers.push(value);
      else if (kind === 'counterparty') data.counterparties.push(value);
      else if (kind === 'contract') data.contracts.push(value);
    }
    return data;
  } finally {
    client.release();
  }
}

export async function replaceZakupSpravochnik(data: ZakupSpravochnikData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM zakup_spravochnik');

    const insertText = `
      INSERT INTO zakup_spravochnik (kind, value)
      VALUES ($1, $2)
    `;

    for (const supplier of data.suppliers) {
      await client.query(insertText, ['supplier', supplier ?? '']);
    }
    for (const counterparty of data.counterparties) {
      await client.query(insertText, ['counterparty', counterparty ?? '']);
    }
    for (const contract of data.contracts) {
      await client.query(insertText, ['contract', contract ?? '']);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// New tables for separate directories

export type SupplierRow = {
  id?: number;
  name: string;
  contact_info: string;
};

export type CounterpartyRow = {
  id?: number;
  name: string;
  type: string;
};

export type ContractDirectoryRow = {
  id?: number;
  type: string;
  description: string;
};

export async function ensureSuppliersTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        contact_info TEXT
      );
    `);
  } finally {
    client.release();
  }
}

export async function ensureCounterpartiesTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS counterparties (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL
      );
    `);
  } finally {
    client.release();
  }
}

export async function ensureContractsDirectoryTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS contracts_directory (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        description TEXT
      );
    `);
  } finally {
    client.release();
  }
}

export async function insertInitialSuppliersData() {
  const client = await pool.connect();
  try {
    const suppliers = [
      { name: 'Supplier A', contact_info: 'contact@supa.com' },
      { name: 'Supplier B', contact_info: 'info@supb.ru' },
      { name: 'Supplier C', contact_info: 'sales@supc.org' },
      { name: 'Supplier D', contact_info: 'hello@supd.net' },
      { name: 'Supplier E', contact_info: 'support@supe.com' },
      { name: 'Supplier F', contact_info: 'admin@supf.ru' },
      { name: 'Supplier G', contact_info: 'team@supg.org' },
      { name: 'Supplier H', contact_info: 'contact@suph.net' },
      { name: 'Supplier I', contact_info: 'info@supi.com' },
      { name: 'Supplier J', contact_info: 'sales@supj.ru' },
    ];
    for (const sup of suppliers) {
      await client.query('INSERT INTO suppliers (name, contact_info) VALUES ($1, $2)', [sup.name, sup.contact_info]);
    }
  } finally {
    client.release();
  }
}

export async function insertInitialCounterpartiesData() {
  const client = await pool.connect();
  try {
    const counterparties = [
      { name: 'Counterparty 1', type: 'Type A' },
      { name: 'Counterparty 2', type: 'Type B' },
      { name: 'Counterparty 3', type: 'Type A' },
      { name: 'Counterparty 4', type: 'Type C' },
      { name: 'Counterparty 5', type: 'Type B' },
      { name: 'Counterparty 6', type: 'Type A' },
      { name: 'Counterparty 7', type: 'Type C' },
      { name: 'Counterparty 8', type: 'Type B' },
      { name: 'Counterparty 9', type: 'Type A' },
      { name: 'Counterparty 10', type: 'Type C' },
    ];
    for (const cp of counterparties) {
      await client.query('INSERT INTO counterparties (name, type) VALUES ($1, $2)', [cp.name, cp.type]);
    }
  } finally {
    client.release();
  }
}

export async function insertInitialContractsDirectoryData() {
  const client = await pool.connect();
  try {
    const contracts = [
      { type: 'Contract Type 1', description: 'Description for type 1' },
      { type: 'Contract Type 2', description: 'Description for type 2' },
      { type: 'Contract Type 3', description: 'Description for type 3' },
      { type: 'Contract Type 4', description: 'Description for type 4' },
      { type: 'Contract Type 5', description: 'Description for type 5' },
      { type: 'Contract Type 6', description: 'Description for type 6' },
      { type: 'Contract Type 7', description: 'Description for type 7' },
      { type: 'Contract Type 8', description: 'Description for type 8' },
      { type: 'Contract Type 9', description: 'Description for type 9' },
      { type: 'Contract Type 10', description: 'Description for type 10' },
    ];
    for (const ct of contracts) {
      await client.query('INSERT INTO contracts_directory (type, description) VALUES ($1, $2)', [ct.type, ct.description]);
    }
  } finally {
    client.release();
  }
}

export async function getSuppliers(): Promise<SupplierRow[]> {
  const client = await pool.connect();
  try {
    const result = await client.query<SupplierRow>('SELECT * FROM suppliers ORDER BY id');
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getCounterparties(): Promise<CounterpartyRow[]> {
  const client = await pool.connect();
  try {
    const result = await client.query<CounterpartyRow>('SELECT * FROM counterparties ORDER BY id');
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getContractsDirectory(): Promise<ContractDirectoryRow[]> {
  const client = await pool.connect();
  try {
    const result = await client.query<ContractDirectoryRow>('SELECT * FROM contracts_directory ORDER BY id');
    return result.rows;
  } finally {
    client.release();
  }
}

export async function replaceSuppliers(rows: SupplierRow[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM suppliers');

    const insertText = `
      INSERT INTO suppliers (name, contact_info)
      VALUES ($1, $2)
    `;

    for (const row of rows) {
      await client.query(insertText, [
        row.name ?? '',
        row.contact_info ?? '',
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

export async function replaceCounterparties(rows: CounterpartyRow[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM counterparties');

    const insertText = `
      INSERT INTO counterparties (name, type)
      VALUES ($1, $2)
    `;

    for (const row of rows) {
      await client.query(insertText, [
        row.name ?? '',
        row.type ?? '',
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

export async function replaceContractsDirectory(rows: ContractDirectoryRow[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM contracts_directory');

    const insertText = `
      INSERT INTO contracts_directory (type, description)
      VALUES ($1, $2)
    `;

    for (const row of rows) {
      await client.query(insertText, [
        row.type ?? '',
        row.description ?? '',
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

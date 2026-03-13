import { pool } from './db.js';
import fs from 'fs';
import path from 'path';

async function exportDatabase() {
  const client = await pool.connect();
  try {
    // Get all tables
    const tablesResult = await client.query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
    `);

    const tables = tablesResult.rows.map(row => row.tablename);

    let dump = '-- PostgreSQL database dump\n\n';

    for (const table of tables) {
      // Get table schema
      const schemaResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position
      `, [table]);

      dump += `-- Table: ${table}\n`;
      dump += `DROP TABLE IF EXISTS ${table} CASCADE;\n`;

      const columns = schemaResult.rows.map(col => {
        let colDef = `"${col.column_name}" ${col.data_type}`;
        if (col.is_nullable === 'NO') colDef += ' NOT NULL';
        if (col.column_default) colDef += ` DEFAULT ${col.column_default}`;
        return colDef;
      }).join(',\n  ');

      dump += `CREATE TABLE ${table} (\n  ${columns}\n);\n\n`;

      // Get data
      const dataResult = await client.query(`SELECT * FROM ${table}`);
      if (dataResult.rows.length > 0) {
        const columnsList = schemaResult.rows.map(col => `"${col.column_name}"`).join(', ');
        dump += `INSERT INTO ${table} (${columnsList}) VALUES\n`;

        const values = dataResult.rows.map(row => {
          const vals = schemaResult.rows.map(col => {
            const val = row[col.column_name];
            if (val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            return val;
          });
          return `(${vals.join(', ')})`;
        });

        dump += values.join(',\n') + ';\n\n';
      } else {
        dump += '\n';
      }
    }

    // Write to file
    const filePath = path.join(process.cwd(), 'postgres_dump.sql');
    fs.writeFileSync(filePath, dump);
    console.log(`Database dump saved to ${filePath}`);
  } finally {
    client.release();
  }
}

exportDatabase().catch(console.error);
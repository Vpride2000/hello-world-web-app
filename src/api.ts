export type DbTimeResponse = {
  success: boolean;
  time: { now: string };
};

export type DogovoryRow = {
  id?: number;
  contract: string;
  counterparty: string;
  sum: string;
  status: string;
  date: string;
};

export type DogovoryResponse = {
  success: boolean;
  rows: DogovoryRow[];
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ?? '/api';

export async function getDbTime(): Promise<DbTimeResponse> {
  const res = await fetch(`${API_BASE_URL}/db-time`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getDogovory(): Promise<DogovoryResponse> {
  const res = await fetch(`${API_BASE_URL}/dogovory`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function saveDogovory(rows: DogovoryRow[]): Promise<DogovoryResponse> {
  const res = await fetch(`${API_BASE_URL}/dogovory`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rows),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

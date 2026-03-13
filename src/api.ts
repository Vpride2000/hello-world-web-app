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

export type ZakupSpravochnikResponse = {
  success: boolean;
  suppliers: string[];
  counterparties: string[];
  contracts: string[];
};

export async function getZakupSpravochnik(): Promise<ZakupSpravochnikResponse> {
  const res = await fetch(`${API_BASE_URL}/zakup/spravochnik`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function saveZakupSpravochnik(data: {
  suppliers: string[];
  counterparties: string[];
  contracts: string[];
}): Promise<ZakupSpravochnikResponse> {
  const res = await fetch(`${API_BASE_URL}/zakup/spravochnik`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

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

export type SuppliersResponse = {
  success: boolean;
  rows: SupplierRow[];
};

export type CounterpartiesResponse = {
  success: boolean;
  rows: CounterpartyRow[];
};

export type ContractsDirectoryResponse = {
  success: boolean;
  rows: ContractDirectoryRow[];
};

export async function getSuppliers(): Promise<SuppliersResponse> {
  const res = await fetch(`${API_BASE_URL}/suppliers`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function saveSuppliers(rows: SupplierRow[]): Promise<SuppliersResponse> {
  const res = await fetch(`${API_BASE_URL}/suppliers`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rows),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getCounterparties(): Promise<CounterpartiesResponse> {
  const res = await fetch(`${API_BASE_URL}/counterparties`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function saveCounterparties(rows: CounterpartyRow[]): Promise<CounterpartiesResponse> {
  const res = await fetch(`${API_BASE_URL}/counterparties`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rows),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getContractsDirectory(): Promise<ContractsDirectoryResponse> {
  const res = await fetch(`${API_BASE_URL}/contracts-directory`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function saveContractsDirectory(rows: ContractDirectoryRow[]): Promise<ContractsDirectoryResponse> {
  const res = await fetch(`${API_BASE_URL}/contracts-directory`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rows),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

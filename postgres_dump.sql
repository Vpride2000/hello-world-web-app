-- PostgreSQL database dump for MyFirstApp
-- Generated manually based on known schema

-- Table: dogovory
DROP TABLE IF EXISTS dogovory CASCADE;
CREATE TABLE dogovory (
  id SERIAL PRIMARY KEY,
  contract TEXT NOT NULL,
  counterparty TEXT NOT NULL,
  sum TEXT NOT NULL,
  status TEXT NOT NULL,
  date TEXT NOT NULL
);

-- Insert sample data (if any)

-- Table: zakup_spravochnik
DROP TABLE IF EXISTS zakup_spravochnik CASCADE;
CREATE TABLE zakup_spravochnik (
  id SERIAL PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('supplier', 'counterparty', 'contract')),
  value TEXT NOT NULL
);

-- Insert sample data (if any)

-- Table: suppliers
DROP TABLE IF EXISTS suppliers CASCADE;
CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  contact_info TEXT
);

INSERT INTO suppliers (name, contact_info) VALUES
('Supplier A', 'contact@supa.com'),
('Supplier B', 'info@supb.ru'),
('Supplier C', 'sales@supc.org'),
('Supplier D', 'hello@supd.net'),
('Supplier E', 'support@supe.com'),
('Supplier F', 'admin@supf.ru'),
('Supplier G', 'team@supg.org'),
('Supplier H', 'contact@suph.net'),
('Supplier I', 'info@supi.com'),
('Supplier J', 'sales@supj.ru');

-- Table: counterparties
DROP TABLE IF EXISTS counterparties CASCADE;
CREATE TABLE counterparties (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL
);

INSERT INTO counterparties (name, type) VALUES
('Counterparty 1', 'Type A'),
('Counterparty 2', 'Type B'),
('Counterparty 3', 'Type A'),
('Counterparty 4', 'Type C'),
('Counterparty 5', 'Type B'),
('Counterparty 6', 'Type A'),
('Counterparty 7', 'Type C'),
('Counterparty 8', 'Type B'),
('Counterparty 9', 'Type A'),
('Counterparty 10', 'Type C');

-- Table: contracts_directory
DROP TABLE IF EXISTS contracts_directory CASCADE;
CREATE TABLE contracts_directory (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  description TEXT
);

INSERT INTO contracts_directory (type, description) VALUES
('Contract Type 1', 'Description for type 1'),
('Contract Type 2', 'Description for type 2'),
('Contract Type 3', 'Description for type 3'),
('Contract Type 4', 'Description for type 4'),
('Contract Type 5', 'Description for type 5'),
('Contract Type 6', 'Description for type 6'),
('Contract Type 7', 'Description for type 7'),
('Contract Type 8', 'Description for type 8'),
('Contract Type 9', 'Description for type 9'),
('Contract Type 10', 'Description for type 10');
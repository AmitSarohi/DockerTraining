-- Initialize employees table and insert sample data
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  department VARCHAR(100) NOT NULL
);

INSERT INTO employees (name, email, department) VALUES
  ('Alice Johnson', 'alice@example.com', 'Engineering'),
  ('Bob Smith', 'bob@example.com', 'Sales'),
  ('Carol Williams', 'carol@example.com', 'HR')
ON CONFLICT DO NOTHING;

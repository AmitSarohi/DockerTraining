const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

const readSecret = (envVar, fileEnvVar, fallback) => {
  // Priority: env var > file path in env var > fallback
  if (process.env[envVar]) return process.env[envVar];
  if (process.env[fileEnvVar]) {
    try {
      return fs.readFileSync(process.env[fileEnvVar], 'utf8').trim();
    } catch (e) {
      return fallback;
    }
  }
  return fallback;
};

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  user: readSecret('DB_USER', 'DB_USER_FILE', 'postgres'),
  password: readSecret('DB_PASSWORD', 'DB_PASSWORD_FILE', 'postgres'),
  database: process.env.DB_NAME || 'employees_db',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const createTables = require("./initDb");
require("dotenv").config();

const CERTS_DIR = path.join(process.cwd(), "certs");

const ensureSslConfig = () => {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  if (!fs.existsSync(CERTS_DIR)) {
    fs.mkdirSync(CERTS_DIR, { recursive: true });
  }

  const certPath = path.join(CERTS_DIR, process.env.CRT_FILE_PATH);

  if (process.env.AZURE_MYSQL_CA_CERT) {
    const certContent = process.env.AZURE_MYSQL_CA_CERT.replace(/\\n/g, "\n");
    fs.writeFileSync(certPath, certContent);
  }

  if (!fs.existsSync(certPath)) {
    throw new Error(`SSL certificate file not found at ${certPath}`);
  }

  return {
    ca: fs.readFileSync(certPath),
    rejectUnauthorized: true,
  };
};

const ensureDatabaseAndTableExists = async (sslConfig) => {
  const connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
  };

  if (sslConfig) {
    connectionConfig.ssl = sslConfig;
  }

  const connection = await mysql.createConnection(connectionConfig);
  console.log(`Checking if database '${process.env.DB_NAME}' exists...`);
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``,
  );

  await createTables(connection);

  await connection.end();
};

const initializeDatabase = async () => {
  const sslConfig = ensureSslConfig();
  await ensureDatabaseAndTableExists(sslConfig);
  console.log("Database initialization complete");
};

const sslConfig = ensureSslConfig();
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

module.exports = {
  pool,
  initializeDatabase,
};

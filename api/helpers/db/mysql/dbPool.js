const mysql = require("mysql2/promise");

/**
 * Creates a MySQL connection pool with given parameters.
 * @param {object} config - Database connection configuration.
 * @param {string} config.host - The database host.
 * @param {string} config.user - The database user.
 * @param {string} config.password - The database password.
 * @param {string} config.database - The database name.
 * @param {number} [config.connectionLimit=10] - The maximum number of connections in the pool.
 * @param {boolean} [config.waitForConnections=true] - Wait for available connections when the pool is full.
 * @param {number} [config.queueLimit=0] - Maximum number of queued connection requests (0 = no limit).
 * @returns {object} - A MySQL connection pool.
 */
function createPool(config) {
  if (!config.host || !config.user || !config.password || !config.database) {
    throw new Error("Missing required database configuration parameters.");
  }

  const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: config.waitForConnections ?? true,
    connectionLimit: config.connectionLimit ?? 10,
    queueLimit: config.queueLimit ?? 0,
  });

  return pool;
}

module.exports = { createPool };

const mysql = require("mysql2/promise");

/**
 * Fetches the schema of a MySQL database.
 * @param {object} config - Database connection configuration.
 * @param {string} config.host - The database host.
 * @param {string} config.user - The database user.
 * @param {string} config.password - The database password.
 * @param {string} config.database - The database name.
 * @returns {Promise<object>} - A structured schema object with tables and their columns.
 */
async function getDatabaseSchema(config) {
  if (!config.host || !config.user || !config.password || !config.database) {
    throw new Error("Missing required database configuration parameters.");
  }

  let connection;
  try {
    connection = await mysql.createConnection(config);

    const sql = `
      SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ?;
    `;

    const [rows] = await connection.execute(sql, [config.database]);

    // Structure the schema as a JSON object
    const schema = rows.reduce((acc, row) => {
      const { TABLE_NAME, COLUMN_NAME, DATA_TYPE } = row;

      if (!acc[TABLE_NAME]) {
        acc[TABLE_NAME] = [];
      }

      acc[TABLE_NAME].push({
        column: COLUMN_NAME,
        type: DATA_TYPE,
      });

      return acc;
    }, {});

    return schema;
  } catch (error) {
    throw new Error(`Error fetching database schema: ${error.message}`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = { getDatabaseSchema };

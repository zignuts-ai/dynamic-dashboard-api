const pool = require("./dbPool");

/**
 * General-purpose query helper to execute any SQL query.
 * @param {string} sql - The SQL query to execute.
 * @param {Array} [params=[]] - The parameters for the SQL query.
 * @returns {Promise<any>} - The results of the query.
 */
async function executeQuery(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error.message);
    throw error; // Re-throw the error for higher-level error handling
  }
}

module.exports = { executeQuery };

import process = require('process');

const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5
});

export async function getConnection() {
  try {
    return pool.getConnection();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function query(sql, params) {
  try {
    const conn = await getConnection();
    return await conn.query(sql, params);
  } catch (err) {
    console.error(err);
    throw err;
  }
}


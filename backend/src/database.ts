import { createPool } from "mariadb";

const pool = createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionLimit: 5,
});

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(sql, params);
    return rows as T;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    conn?.release();
  }
}

export default pool;

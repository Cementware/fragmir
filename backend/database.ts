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

// initializes the database and its tables
export async function init() {
  try {
    await query('CREATE TABLE IF NOT EXISTS users (\
      ID BINARY(16) NOT NULL,\
      username VARCHAR(128) NOT NULL,\
      email VARCHAR(64) NOT NULL,\
      password VARCHAR(255) NOT NULL,\
      PRIMARY KEY(ID)\
    )');
    await query('CREATE TABLE IF NOT EXISTS questions(\
      ID BINARY(16) NOT NULL,\
      SENDER_ID BINARY(16)\
      RECEIPIENT_ID BINARY(16)\
      question TEXT NOT NULL,\
      answer TEXT NOT NULL,\
      publish BIT NOT NULL DEFAULT 0,\
      time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
      PRIMARY KEY(ID),\
      CONSTRAINT fk_sender\
        FOREIGN KEY (SENDER_ID) REFERENCES users(ID)\
        ON DELETE CASCADE,\
      CONSTRAINT fk_receipient\
        FOREIGN KEY (RECEIPIENT_ID) REFERENCES users(ID)\
        ON DELETE CASCADE\
    )')
  } catch (err) {
    console.error(err);
    throw err;
  }
}

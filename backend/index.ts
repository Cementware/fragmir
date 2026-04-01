import process = require("node:process");

const express = require('express');
const cors = require('cors');
const mariadb = require('mariadb');

const app = express();
app.use(cors());

console.log('Starting...');
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionLimit: 5
});

pool.getConnection().then(conn => console.log(conn));

app.get('/api/status', (_, res) => {
  res.json({ message: "Backend is running and connected!" });
});

app.listen(3000, () => console.log('Backend listening on port 3000'));

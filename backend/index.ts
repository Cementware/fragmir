const express = require('express');
const cors = require('cors');
const db = require('./database.ts');

const app = express();
app.use(cors());

console.log('Starting...');
app.get('/api/status', (_, res) => {
  res.json({ message: "Backend is running and connected!" });
});

app.listen(3000, () => console.log('Backend listening on port 3000'));

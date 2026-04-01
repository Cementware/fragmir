const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/status', (_, res) => {
  res.json({ message: "Backend is running and connected!" });
});

app.listen(3000, () => console.log('Backend listening on port 3000'));

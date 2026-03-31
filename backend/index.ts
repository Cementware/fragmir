import express from 'express';
const app = express();

app.get('/api/status', (req, res) => {
  res.json({ message: "Backend is running and connected!" });
});

app.listen(3000, () => console.log('Backend listening on port 3000'));

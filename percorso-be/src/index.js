// percorso-be/src/index.js
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/accounts', (req, res) => {
  res.json([
    { id: 1, iban: 'IT60X0542811101000000123456', balance: '1500.00' },
    { id: 2, iban: 'IT60X0542811101000000654321', balance: '8200.50' },
  ]);
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});

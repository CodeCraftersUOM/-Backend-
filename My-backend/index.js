const express = require('express');
const app = express();

// Correct database import
require('./Config/db');

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgers',
  host: 'localhost',
  database: 'postgers',
  password: '1111',
  port: 5432,
});

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile('./index.html', { root: __dirname });
  });

app.listen(port, () => {
  console.log(`Сервер запущен http://localhost:${port}`);
});
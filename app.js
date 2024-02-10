const { v4: uuidv4 } = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1111',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Ошибка при подключении к БД', err.stack);
  } else {
    console.log('Успешное подключение к БД');
  }
  release();
});

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log('Запрос к корневому пути');
  res.sendFile('./index.html', { root: __dirname });
});

app.post('/saveSortedArray', async (req, res) => {
  try {
      const { sortedArray } = req.body;

      const client = await pool.connect();

      try {
          const sorting_id = uuidv4();

          await client.query('BEGIN');

          for (const element of sortedArray) {
              await client.query('INSERT INTO sorted_arrays (sorting_id, array_element) VALUES ($1, $2)', [sorting_id, element]);
          }

          await client.query('COMMIT');

          res.status(200).json({ sorting_id });
      } finally {
          await client.query('ROLLBACK');
          client.release();
      }
  } catch (error) {
      console.error('Ошибка при сохранении в базе данных:', error.message);
      res.status(500).json({ error: 'Ошибка при сохранении в базе данных' });
  }
});

app.get('/getSortedArray/:sorting_id', async (req, res) => {
  try {
      const { sorting_id } = req.params;

      const result = await pool.query('SELECT array_element FROM sorted_arrays WHERE sorting_id = $1 ORDER BY id', [sorting_id]);

      if (result.rows.length === 0) {
          res.status(404).json({ error: 'Результат с указанным ID не найден' });
      } else {
          const sortedArray = result.rows.map(row => row.array_element);
          res.status(200).json({ sortedArray });
      }
  } catch (error) {
      console.error('Ошибка при получении отсортированного массива из базы данных:', error.message);
      res.status(500).json({ error: 'Ошибка при получении отсортированного массива из базы данных' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен http://localhost:${port}`);
});

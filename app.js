const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());

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

app.get('/', (req, res) => {
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

      console.log('Записи с id', sorting_id, ' были успешно сохранены в БД');
      res.status(200).json({ sorting_id });
    } finally {
      await client.query('ROLLBACK');
      client.release();
    }
  } catch (error) {
    console.error('Ошибка при сохранении в БД:', error.message);
    res.status(500).json({ error: 'Ошибка при сохранении записей в БД' });
  }
});

app.get('/getSortedArray/:sorting_id', async (req, res) => {
  try {
    const { sorting_id } = req.params;
    const result = await pool.query('SELECT array_element FROM sorted_arrays WHERE sorting_id = $1 ORDER BY id', [sorting_id]);

    if (!result.rows || result.rows.length === 0) {
      console.log('Обращение к несуществующим записям БД');
      res.render('result', { errorMessage: 'Результат с указанным ID не найден' });
    } else {
      const sortedArray = result.rows.map(row => row.array_element);
      console.log('Обращение к записям БД с id', sorting_id);
      res.render('result', { sortedArray, errorMessage: null }); 
    }
  } catch (error) {
    console.error('Ошибка при получении записей из БД:', error.message);
    res.render('result', { errorMessage: 'Ошибка при получении записей из БД'});
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен http://localhost:${port}`);
});
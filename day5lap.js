const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  user: 'postgres',       
  host: 'localhost',      
  database: 'trial_0',
  password: 'Blueberry_29',
  port: 5432,              
});

app.get('/items', async (req, res) => {
  try {
    const { q } = req.query;

    let query = 'SELECT * FROM items';
    let queryParams = [];

    if (q) {
      query += ' WHERE name ILIKE $1';
      queryParams.push(`%${q}%`);
    }

    query += ' ORDER BY id ASC';

    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/items', async (req, res) => {
  try {
    const { name, age } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (age === undefined || isNaN(age)) {
      return res.status(400).json({ message: 'Age must be a number' });
    }

    const query = 'INSERT INTO items (name, age) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [name.trim(), Number(age)]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, age } = req.body;

    const checkItem = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if (checkItem.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const currentItem = checkItem.rows[0];
    const newName = name !== undefined ? String(name).trim() : currentItem.name;
    const newAge = age !== undefined && !isNaN(age) ? Number(age) : currentItem.age;

    const updateQuery = 'UPDATE items SET name = $1, age = $2 WHERE id = $3 RETURNING *';
    const updatedResult = await pool.query(updateQuery, [newName, newAge, id]);

    res.json(updatedResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const deleteQuery = 'DELETE FROM items WHERE id = $1 RETURNING *';
    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
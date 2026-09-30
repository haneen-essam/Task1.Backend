const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const dataPath = path.join(__dirname, 'data.json');

function readData() {
  const fileContent = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(fileContent);
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

app.get('/items', (req, res) => {
  const items = readData();
  res.json(items);
});

app.post('/items', (req, res) => {
  const name = req.body.name;
  const age = req.body.age;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  if (isNaN(age)) {
    return res.status(400).json({ message: 'Age must be a number' });
  }

  const items = readData();
  const newItem = {
    id: items.length + 1,
    name: name,
    age: Number(age)
  };

  items.push(newItem);
  saveData(items);

  res.status(201).json(newItem);
});

app.put('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const items = readData();

  const item = items.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  if (req.body.name) {
    item.name = req.body.name;
  }

  if (req.body.age) {
    if (isNaN(req.body.age)) {
      return res.status(400).json({ message: 'Age must be a number' });
    }
    item.age = Number(req.body.age);
  }

  saveData(items);
  res.json(item);
});

app.delete('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const items = readData();

  const index = items.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  items.splice(index, 1);
  saveData(items);

  res.json({ message: 'Item deleted successfully' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
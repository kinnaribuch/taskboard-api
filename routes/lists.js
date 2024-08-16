// routes/lists.js

import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Path to boards.json
// const dataPath = path.join(__dirname, '../boards.json');
const dataPath = path.join(process.cwd(), 'boards.json');

// Function to read data
const readData = () => {
  const jsonData = fs.readFileSync(dataPath);
  return JSON.parse(jsonData);
};

// Function to write data
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// POST /api/boards/:boardId/lists
router.post('/boards/:boardId/lists', (req, res) => {
  const { boardId } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'List title is required.' });
  }

  const data = readData();
  const board = data.boards.find((b) => b.id === boardId);

  if (!board) {
    return res.status(404).json({ message: 'Board not found.' });
  }

  const newList = {
    id: Date.now().toString(), // Simple unique ID
    title,
    tasks: [],
  };

  board.list.push(newList);
  writeData(data);

  res.status(201).json({ message: 'List added successfully.', list: newList });
});

export default router;
import fs from 'fs';

const dataPath = "./data/boards.json";

// Function to read data from the JSON file
const readData = () => {
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData);
  };
  
  // Function to write data to the JSON file
  const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  };
  
// Controller to create a new list within a board
export const createList = (req, res) => {
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
};

// Controller to add a new card to a list
export const addCardToList = (req, res) => {
  const { boardId, listId } = req.params;
  const { title } = req.body;
  const data = readData();
  const board = data.boards.find(b => b.id === boardId);

  if (!board) {
    return res.status(404).json({ message: 'Board not found' });
  }

  const list = board.list.find(l => l.id === listId);
  if (!list) {
    return res.status(404).json({ message: 'List not found' });
  }

  if (!list.tasks) {
    list.tasks = [];
  }

  const newCard = {
    id: Date.now().toString(), // Unique ID generation for the new card
    title,
    description: '', // Default empty description
    assignee: '' // Default empty assignee
  };

  list.tasks.push(newCard);
  writeData(data);
  res.status(201).json(newCard);
};

// Controller to delete a task from a list
export const deleteTask = (req, res) => {
  const { boardId, listId, taskId } = req.params;
  const data = readData();
  const board = data.boards.find(board => board.id === boardId);

  if (!board) {
    return res.status(404).json({ message: 'Board not found' });
  }

  const list = board.list.find(list => list.id === listId);
  if (!list) {
    return res.status(404).json({ message: 'List not found' });
  }

  const taskIndex = list.tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  list.tasks.splice(taskIndex, 1);
  writeData(data);
  res.status(204).send();  // No content to send back
};

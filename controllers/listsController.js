import fs from 'fs';

const dataPath = "./data/boards.json";

// Function to read data from the JSON file
const readData = () => {
  try {
    const jsonData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(jsonData);
  } catch (err) {
    console.error("Error reading data:", err);
    return { users: {} }; // Return a default structure if the file is not found or corrupted
  }
};

// Function to write data to the JSON file
const writeData = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing data:", err);
  }
};

// Controller to create a new list within a board
export const createList = (req, res) => {
  const { boardId } = req.params;
  const { title, userId } = req.body; // Get userId from the body

  console.log("UserId:", userId);
  console.log("BoardId:", boardId);
  console.log("Title:", title);

  if (!title) {
    return res.status(400).json({ message: 'List title is required.' });
  }

  const data = readData();

  console.log("Data from file:", data);

  const userBoards = data.users[userId]?.boards;
  if (!userBoards) {
    console.log("User or boards not found.");
    return res.status(404).json({ message: 'User or boards not found.' });
  }

  const board = userBoards.find((b) => b.id === boardId);
  if (!board) {
    console.log("Board not found.");
    return res.status(404).json({ message: 'Board not found.' });
  }

  const newList = {
    id: Date.now().toString(),
    title,
    tasks: [],
  };

  board.list.push(newList);
  writeData(data);

  res.status(201).json({ message: 'List added successfully.', list: newList });
};

// Controller to add a new card to a list
export const addCardToList = (req, res) => {
  const { boardId, listId } = req.params;  // Extract boardId and listId from URL params
  const { title, userId } = req.body;  // Extract title and userId from the request body

  console.log("UserId:", userId);
  console.log("BoardId:", boardId);
  console.log("ListId:", listId);
  console.log("Title:", title);

  if (!title) {
    return res.status(400).json({ message: 'Card title is required.' });
  }

  const data = readData();

  console.log("Data from file:", data);

  const userBoards = data.users[userId]?.boards;
  if (!userBoards) {
    console.log("User or boards not found.");
    return res.status(404).json({ message: 'User or boards not found.' });
  }

  const board = userBoards.find(b => b.id === boardId);
  if (!board) {
    console.log("Board not found.");
    return res.status(404).json({ message: 'Board not found' });
  }

  const list = board.list.find(l => l.id === listId);
  if (!list) {
    console.log("List not found.");
    return res.status(404).json({ message: 'List not found' });
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
  const data = readData(); // Use readData instead of readBoards

  let userFound = false;
  for (const userId in data.users) {
    const userBoards = data.users[userId].boards;

    // Find the board
    const board = userBoards.find(b => b.id === boardId);
    if (board) {
      userFound = true;

      // Find the list
      const list = board.list.find(l => l.id === listId);
      if (list) {
        // Find the task
        const taskIndex = list.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          list.tasks.splice(taskIndex, 1); // Remove the task
          writeData(data); // Use writeData instead of writeBoards
          return res.status(200).json({ message: 'Task deleted successfully' });
        } else {
          return res.status(404).json({ message: 'Task not found' });
        }
      } else {
        return res.status(404).json({ message: 'List not found' });
      }
    }
  }

  if (!userFound) {
    return res.status(404).json({ message: 'User or board not found' });
  }
};

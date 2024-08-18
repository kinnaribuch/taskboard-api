import fs from 'fs';

const dataPath = "./data/boards.json";

// Function to read boards from the JSON file
const readBoards = () => {
  try {
    const boards = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(boards);
  } catch (err) {
    console.error("Error reading boards data:", err);
    return { users: {} }; // Return a default structure if the file is not found or corrupted
  }
};

// Function to write boards to the JSON file
const writeBoards = (boards) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(boards, null, 2));
  } catch (err) {
    console.error("Error writing boards data:", err);
  }
};

// Get all boards for a specific user
export const getBoards = (req, res) => {
  const { userId } = req.query; // Get the user ID from the query params
  const boardsData = readBoards();

  if (!userId || !boardsData.users[userId]) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userBoards = boardsData.users[userId]?.boards || [];
  res.json({ boards: userBoards });
};

// Get a single board by its ID for a specific user
export const getBoardById = (req, res) => {
  const { userId, boardId } = req.params;
  const boardsData = readBoards(); // Read all boards

  if (!userId || !boardsData.users[userId]) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userBoards = boardsData.users[userId]?.boards || []; // Get boards for the specific user

  const board = userBoards.find((board) => board.id === boardId); // Find the board by id

  if (!board) {
    return res.status(404).json({ message: 'Board not found' });
  }

  res.json({
    active: 0,
    boards: [board],
  });
};

// Create a new board for a specific user
export const createBoard = (req, res) => {
  const { userId, board } = req.body;

  if (!userId || !board) {
    return res.status(400).json({ message: "User ID and board data are required" });
  }

  const boardsData = readBoards();

  if (!boardsData.users[userId]) {
    boardsData.users[userId] = { boards: [] }; // Create a new user entry if it doesn't exist
  }

  board.id = Date.now().toString(); // Assign a unique ID to the new board

  boardsData.users[userId].boards.push(board);

  writeBoards(boardsData);

  res.status(201).json(board);
};

// Delete a board by its ID for a specific user
export const deleteBoard = (req, res) => {
  const { userId, boardId } = req.params;
  const boardsData = readBoards();

  if (!userId || !boardsData.users[userId]) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userBoards = boardsData.users[userId]?.boards || [];
  const boardIndex = userBoards.findIndex(board => board.id === boardId);

  if (boardIndex === -1) {
    return res.status(404).json({ message: 'Board not found' });
  }

  userBoards.splice(boardIndex, 1);
  writeBoards(boardsData);

  res.status(204).send();  // No content to send back
};

// Update a board's list and tasks for a specific user
export const updateBoard = (req, res) => {

  const { userId } = req.body; // Assume userId is sent in the request body
  const { boardId } = req.params; // Keep boardId in params
  const updatedBoard = req.body;
  const boardsData = readBoards();

  if (!userId || !boardsData.users[userId]) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userBoards = boardsData.users[userId]?.boards || [];
  const boardIndex = userBoards.findIndex(board => board.id === boardId);

  if (boardIndex === -1) {
    return res.status(404).json({ message: 'Board not found' });
  }

  userBoards[boardIndex] = {
    ...userBoards[boardIndex],
    ...updatedBoard,
  };

  writeBoards(boardsData);
  res.status(200).json({ message: 'Board updated successfully' });
};


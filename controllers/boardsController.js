import fs from 'fs';

const dataPath = "./data/boards.json";

// Function to read boards from the JSON file
const readBoards = () => {
  const boards = fs.readFileSync(dataPath);
  return JSON.parse(boards);
};

// Function to write boards to the JSON file
const writeBoards = (boards) => {
  fs.writeFileSync(dataPath, JSON.stringify(boards, null, 2));
};

// Get all boards
export const getBoards = (req, res) => {
  const boards = readBoards();
  res.json(boards);
};

// Get a single board by its ID
export const getBoardById = (req, res) => {
  const { boardId } = req.params;
  const boards = readBoards();
  const board = boards.boards.find(board => board.id === boardId);

  if (!board) {
    return res.status(404).json({ message: 'Board not found' });
  }

  res.json({
    active: 0,
    boards: [board], // Wrapping the single board in an array
  });
};

// Create a new board
export const createBoard = (req, res) => {
  const newBoard = req.body;
  const boards = readBoards();
  boards.boards.push(newBoard);
  writeBoards(boards);
  res.status(201).json(newBoard);
};

// Delete a board by its ID
export const deleteBoard = (req, res) => {
  const { boardId } = req.params;
  const boards = readBoards();
  const boardIndex = boards.boards.findIndex(board => board.id === boardId);

  if (boardIndex === -1) {
    return res.status(404).json({ message: 'Board not found' });
  }

  boards.boards.splice(boardIndex, 1);
  writeBoards(boards);
  res.status(204).send();  // No content to send back
};

// Update a board's list and tasks (e.g., after drag-and-drop)
export const updateBoard = (req, res) => {
  const { boardId } = req.params;
  const updatedBoard = req.body;
  const boards = readBoards();
  const boardIndex = boards.boards.findIndex(board => board.id === boardId);

  if (boardIndex === -1) {
    return res.status(404).json({ message: 'Board not found' });
  }

  boards.boards[boardIndex] = {
    ...boards.boards[boardIndex],
    ...updatedBoard,
  };

  writeBoards(boards);
  res.status(200).json({ message: 'Board updated successfully' });
};

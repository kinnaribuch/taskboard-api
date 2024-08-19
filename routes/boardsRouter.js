import express from 'express';
import {
  getBoards,
  getBoardById,
  createBoard,
  deleteBoard,
  updateBoard
} from '../controllers/boardsController.js';

const router = express.Router();

router.get('/boards', getBoards); // Fetch all boards for a user
router.get('/boards/:userId/:boardId', getBoardById); // Fetch a specific board by ID for a user
router.post('/boards', createBoard); // Create a new board for a user
router.delete('/boards/:userId/:boardId', deleteBoard); // Delete a board by ID for a user
router.put('/boards/:userId/:boardId', updateBoard); // Update a board for a user


export default router;

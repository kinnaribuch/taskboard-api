import express from 'express';
import {
  getBoards,
  getBoardById,
  createBoard,
  deleteBoard,
  updateBoard,
} from '../controllers/boardsController.js';

const router = express.Router();

router.get('/boards', getBoards);
router.get('/boards/:boardId', getBoardById);
router.post('/boards', createBoard);
router.delete('/boards/:boardId', deleteBoard);
router.put('/boards/:boardId', updateBoard);

export default router;
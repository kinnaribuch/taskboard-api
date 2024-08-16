import express from 'express';
import { createList, addCardToList, deleteTask } from '../controllers/listsController.js';

const router = express.Router();

// Route to create a new list
router.post('/boards/:boardId/lists', createList);

// Route to add a new card to a list
router.post('/boards/:boardId/lists/:listId/cards', addCardToList);

// Route to delete a task from a list
router.delete('/boards/:boardId/lists/:listId/tasks/:taskId', deleteTask);

export default router;

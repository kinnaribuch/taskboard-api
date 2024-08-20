import express from 'express';
import { getUsers } from '../controllers/usersController.js'; // Import the users controller

const router = express.Router();

// Define the route to fetch all users
router.get('/users', getUsers);

export default router;

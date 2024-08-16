import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the JSON file where users will be stored
const usersFilePath = path.join(__dirname, '../users.json');

// Helper function to read users from the JSON file
const readUsers = () => {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
  }
  const users = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(users);
};

// Helper function to write users to the JSON file
const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Signup route
router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  const users = readUsers();

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const newUser = { id: Date.now(), username, email, password };
  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: 'User created successfully' });
});

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  res.status(200).json({ message: 'Login successful', success: true });
});

export default router;

import fs from 'fs';

const dataPath = "./data/users.json";

// Function to read users from the JSON file
const readUsers = () => {
  const users = fs.readFileSync(dataPath);
  return JSON.parse(users);
};

// Function to write users to the JSON file
const writeUsers = (users) => {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
};

// Controller for signup
export const signupUser = (req, res) => {
  const { username, email, password } = req.body;
  const users = readUsers();

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const newUser = { id: Date.now(), username, email, password };
  users.push(newUser);
  writeUsers(users);  // Save the updated user list to the file

  res.status(201).json({ message: 'User created successfully', userId: newUser.id });
};

// Controller for login
export const loginUser = (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  res.status(200).json({ message: 'Login successful', success: true, userId: user.id, username: user.username });
};

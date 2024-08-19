import fs from 'fs';

const dataPath = './data/users.json'; // Path to your users JSON file

// Function to read users from the JSON file
const readUsers = () => {
  try {
    const users = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(users);
  } catch (err) {
    console.error("Error reading users data:", err);
    return []; // Return an empty array if the file is not found or corrupted
  }
};

// Get all users
export const getUsers = (req, res) => {
  try {
    const users = readUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Other user-related functions can be added here

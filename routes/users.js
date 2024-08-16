import express from 'express';
import fs from 'fs';

const router = express.Router();

router.get('/boards/:userId', (req, res) => {
    const { userId } = req.params;
    console.log("checking");
    
    fs.readFile(boardsFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Failed to read boards data' });
      }
      
      let boardsData;
      try {
        boardsData = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return res.status(500).json({ error: 'Failed to parse boards data' });
      }
      
      // Access the boards for the specific userId
      const userBoards = boardsData.users[userId];
  
      if (!userBoards) {
        return res.status(404).json({ message: 'No boards found for this user' });
      }
  
      res.json({
        active: boardsData.active,
        boards: userBoards
      });
    });
  });
  
  //single user
  router.get('/boards/:userId/:boardId', async (req, res) => {
    const { userId, boardId } = req.params;
  
    try {
      const data = await fs.readFile(boardsFilePath, 'utf-8');
      const boardsData = JSON.parse(data);
  
      // Access the user's boards array
      const userBoards = boardsData.users[userId];
  
      if (!userBoards) {
        return res.status(404).json({ message: 'No boards found for this user' });
      }
  
      // Find the specific board by its ID
      const board = userBoards.find(board => board.id === boardId);
  
      if (!board) {
        return res.status(404).json({ message: 'Board not found' });
      }
  
      res.json(board);
    } catch (err) {
      console.error('Error reading or parsing boards data:', err);
      res.status(500).json({ error: 'Failed to read boards data' });
    }
  });

  // Route to create a new board for a specific user
  router.post('/boards/:userId', (req, res) => {
    const { userId } = req.params;
    const newBoard = req.body;
  
    fs.readFile(boardsFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Failed to read boards data' });
      }
  
      let boardsData;
      try {
        boardsData = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return res.status(500).json({ error: 'Failed to parse boards data' });
      }
  
      // Ensure user object exists
      if (!boardsData.users[userId]) {
        boardsData.users[userId] = { boards: [] };
      }
  
      boardsData.users[userId].boards.push(newBoard);
  
      fs.writeFile(boardsFilePath, JSON.stringify(boardsData, null, 2), (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return res.status(500).json({ error: 'Failed to save new board' });
        }
  
        res.status(201).json(newBoard);
      });
    });
  });

  
// Delete a board for a specific user
router.delete('/boards/:userId/:boardId', (req, res) => {
  const { userId, boardId } = req.params;
  const boardsData = JSON.parse(fs.readFileSync('boards.json'));

  if (boardsData.users[userId]) {
    boardsData.users[userId].boards = boardsData.users[userId].boards.filter(board => board.id !== boardId);
    fs.writeFileSync('boards.json', JSON.stringify(boardsData, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Board not found' });
  }
});

export default router;
import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Path to the JSON file where board data will be stored
const boardsFilePath = path.join(process.cwd(), 'boards.json');

// Route to get boards data
router.get('/boards', (req, res) => {
  fs.readFile(boardsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read boards data' });
    }
    const boards = JSON.parse(data);
    res.json(boards);
  });
});

// Route to get a single board by its ID
router.get('/boards/:boardId', (req, res) => {
  const { boardId } = req.params;

  fs.readFile(boardsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Failed to read boards data' });
    }

    const boards = JSON.parse(data);
    const board = boards.boards.find(board => board.id === boardId);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.json({
      active: 0,
      boards: [board] // Wrapping the single board in an array
    });
  });
});

// Route to create a new board
router.post('/boards', (req, res) => {
  const newBoard = req.body;

  fs.readFile(boardsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Failed to read boards data' });
    }

    const boards = JSON.parse(data);
    boards.boards.push(newBoard);

    fs.writeFile(boardsFilePath, JSON.stringify(boards, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ error: 'Failed to save new board' });
      }

      res.status(201).json(newBoard);
    });
  });
});

// Route to delete a board by its ID
router.delete('/boards/:boardId', (req, res) => {
  const { boardId } = req.params;

  fs.readFile(boardsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Failed to read boards data' });
    }

    const boards = JSON.parse(data);
    const boardIndex = boards.boards.findIndex(board => board.id === boardId);

    if (boardIndex === -1) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Remove the board from the array
    boards.boards.splice(boardIndex, 1);

    fs.writeFile(boardsFilePath, JSON.stringify(boards, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ error: 'Failed to delete board' });
      }

      res.status(204).send();  // No content to send back
    });
  });
});

// Route to add a new card to a list
router.post('/boards/:boardId/lists/:listId/cards', (req, res) => {
  const { boardId, listId } = req.params;
  const { title } = req.body;

  fs.readFile(boardsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read boards data' });
    }

    const boards = JSON.parse(data);
    const board = boards.boards.find(b => b.id === boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const list = board.list.find(l => l.id === listId);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Ensure the tasks array exists
    if (!list.tasks) {
      list.tasks = [];
    }

    const newCard = {
      id: Date.now().toString(), // Unique ID generation for the new card
      title,
      description: '', // Default empty description
      assignee: '' // Default empty assignee
    };

    list.tasks.push(newCard);

    fs.writeFile(boardsFilePath, JSON.stringify(boards, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save new card' });
      }
      res.status(201).json(newCard);
    });
  });
});

// Route to delete a task from a list
router.delete('/boards/:boardId/lists/:listId/tasks/:taskId', (req, res) => {
    const { boardId, listId, taskId } = req.params;

    // Load the JSON data
    fs.readFile(boardsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }

        const boards = JSON.parse(data);
        const board = boards.boards.find(board => board.id === boardId);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        const list = board.list.find(list => list.id === listId);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        const taskIndex = list.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Remove the task
        list.tasks.splice(taskIndex, 1);

        // Save the updated data back to the JSON file
        fs.writeFile(boardsFilePath, JSON.stringify(boards, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).json({ error: 'Failed to save data' });
            }

            res.status(204).send();  // No content to send back
        });
    });
});

// Route to update a board's list and tasks (e.g., after drag-and-drop)
router.put('/boards/:boardId', (req, res) => {
  const { boardId } = req.params;
  const updatedBoard = req.body;

  fs.readFile(boardsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Failed to read boards data' });
    }

    const boards = JSON.parse(data);
    const boardIndex = boards.boards.findIndex(board => board.id === boardId);

    if (boardIndex === -1) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Update the board with the new list and task order
    boards.boards[boardIndex] = {
      ...boards.boards[boardIndex],
      ...updatedBoard,
    };

    fs.writeFile(boardsFilePath, JSON.stringify(boards, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ error: 'Failed to update board' });
      }
      res.status(200).json({ message: 'Board updated successfully' });
    });
  });
});

export default router;
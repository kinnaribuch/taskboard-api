import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRouter.js';
import listRoutes from './routes/listsRouter.js';
import boardRoutes from './routes/boardsRouter.js';
import userRoutes from './routes/usersRouter.js';

const app = express();
import "dotenv/config"
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use the auth routes
app.use('/api', authRoutes);

// Use the board routes
app.use('/api', boardRoutes);

// Use the lists routes
app.use('/api', listRoutes);

// Use the lists routes
app.use('/api', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

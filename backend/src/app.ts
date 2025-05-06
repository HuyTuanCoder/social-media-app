import express, { Request, Response } from 'express';
import cors from 'cors';

// import API routes here
import userRoutes from './routes/user.routes';
import FriendshipRoutes from './routes/friendship.routes';
import ChatRoutes from './routes/chat.routes';
import reportRoutes from './routes/report.routes';


import requestLogger from './middlewares/requestLogger';
import { unknownEndpoint, errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Request logger middleware
app.use(requestLogger);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from TypeScript backend!' });
});

// User routes
app.use('/user', userRoutes);

// Friendship routes
app.use('/friendship', FriendshipRoutes);

// Chat routes
app.use('/chat', ChatRoutes);

// Report routes
app.use('/reports', reportRoutes);

// Handle unknown endpoints
app.use(unknownEndpoint);

// Error-handling middleware
app.use(errorHandler);

export default app;

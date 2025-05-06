import { Request, Response } from 'express';
import prisma from '../db';
import asyncHandler from '../utils/asyncHandler';
import logger from '../middlewares/logger';

// Create a new user
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email } = req.body;

  // Validate input
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }

  // Create a new user in the database
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
    },
  });

  logger.info('Created new user', {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip,
    headers: req.headers,
  });

  res.status(201).json(newUser);
});

// Login a user (match by username or email)
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = req.body; // `identifier` can be either username or email

  // Validate input
  if (!identifier) {
    return res.status(400).json({ error: 'Identifier (username or email) is required' });
  }

  // Find the user by username or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  logger.info('Login a user', {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip,
    headers: req.headers,
  });

  // Return user information
  res.json(user);
});

// Delete a user
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Delete the user by ID
  const deletedUser = await prisma.user.delete({
    where: { id },
  });

  logger.info('Delete a user', {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip,
    headers: req.headers,
  });

  res.json({ message: 'User deleted successfully', deletedUser });
});

// Update a user's username or email
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email } = req.body;

  // Validate input
  if (!username && !email) {
    return res.status(400).json({ error: 'At least one of username or email is required' });
  }

  // Check if the user exists
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Update the user's information
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...(username && { username }), // Update username if provided
      ...(email && { email }), // Update email if provided
    },
  });

  logger.info('Updated user', {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip,
    headers: req.headers,
  });

  res.status(200).json({ message: 'User updated successfully', updatedUser });
});

export const getTotalUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await prisma.$queryRaw<
    Array<Record<string, bigint | number>>
  >`CALL GetTotalUsers()`;
  
  // Safely convert the bigint to number
  const totalUsers = Number(result[0]?.totalUsers || 0);
  
  res.json({ totalUsers });
});

// Search users by username or email
export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query; // Extract the query parameter

  // Validate input
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required and must be a string' });
  }

  // Search for users whose username or email matches the query
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query } }, // Case-insensitive search for username
        { email: { contains: query } },    // Case-insensitive search for email
      ],
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  res.status(200).json(users);
});
import { Request, Response } from 'express';
import prisma from '../db';
import asyncHandler from '../utils/asyncHandler';

// Automatically befriend two users
export const createFriendship = asyncHandler(async (req: Request, res: Response) => {
  const { userAId, userBId } = req.body;

  // Validate input
  if (!userAId || !userBId) {
    return res.status(400).json({ error: 'Both userId and friendId are required' });
  }

  // Create a friendship record
  const friendship = await prisma.friendship.create({
    data: {
      userAId,
      userBId,
    },
  });

  res.status(201).json({ message: 'Friendship created successfully', friendship });
});

// Delete a friendship between two users
export const deleteFriendship = asyncHandler(async (req: Request, res: Response) => {
  const { userAId, userBId } = req.body;

  // Validate input
  if (!userAId || !userBId) {
    return res.status(400).json({ error: 'Both ids are required' });
  }

  // Delete the friendship record
  // use deleteMany because of the OR clause although there is only 1 entry in the table
  const deletedFriendship = await prisma.friendship.deleteMany({
    where: {
      OR: [
        { userAId, userBId },
        { userAId: userBId, userBId: userAId }, // Handle bidirectional friendship
      ],
    },
  });

  if (deletedFriendship.count === 0) {
    return res.status(404).json({ error: 'Friendship not found' });
  }

  res.status(200).json({ message: 'Friendship deleted successfully' });
});

export const searchFriends = asyncHandler(async (req: Request, res: Response) => {
  const { userId, pattern } = req.body; // Extract the current user's ID and search pattern from the request body

  // Validate input
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'A valid userId is required' });
  }
  if (!pattern || typeof pattern !== 'string') {
    return res.status(400).json({ error: 'A valid search pattern is required' });
  }

  // Find friends of the current user
  const friends = await prisma.friendship.findMany({
    where: {
      OR: [
        { userAId: userId }, // Friends where the current user is userA
        { userBId: userId }, // Friends where the current user is userB
      ],
    },
    // Using include here to fetch related data from the userId
    include: {
      userA: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      userB: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  // Filter friends based on the search pattern
  const filteredFriends = friends
    .map((friendship) =>
      friendship.userAId === userId
        ? friendship.userB // If the current user is userA, return userB
        : friendship.userA // If the current user is userB, return userA
    )
    .filter(
      (friend) =>
        friend.username.toLowerCase().includes(pattern.toLowerCase()) ||
        friend.email.toLowerCase().includes(pattern.toLowerCase())
    );

  res.json(filteredFriends);
});
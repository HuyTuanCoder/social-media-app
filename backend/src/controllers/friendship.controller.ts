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
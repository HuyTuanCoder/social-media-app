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

  // Prevent users from befriending themselves
  if (userAId === userBId) {
    return res.status(400).json({ error: 'You cannot add yourself as a friend' });
  }

  // Check if the friendship already exists
  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userAId, userBId },
        { userAId: userBId, userBId: userAId },
      ],
    },
  });

  if (existingFriendship) {
    return res.status(400).json({ error: 'Friendship already exists' });
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

// Delete a friendship by friendship ID
export const deleteFriendship = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // Extract friendship ID from the request parameters

  // Validate input
  if (!id) {
    return res.status(400).json({ error: 'Friendship ID is required' });
  }

  // Delete the friendship record
  const deletedFriendship = await prisma.friendship.delete({
    where: { id },
  });

  res.status(200).json({ message: 'Friendship deleted successfully', deletedFriendship });
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

export const getAllFriends = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params; // Extract the userId from the request parameters

  // Validate input
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Find all friendships where the user is either userA or userB
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { userAId: userId }, // Friendships where the user is userA
        { userBId: userId }, // Friendships where the user is userB
      ],
    },
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

  // Map friendships to return the other user and friendship details
  const friends = friendships.map((friendship) => {
    const isUserA = friendship.userAId === userId;
    const otherUser = isUserA ? friendship.userB : friendship.userA;

    return {
      friendshipId: friendship.id,
      username: otherUser.username,
      email: otherUser.email,
      id: otherUser.id,
      friendshipDate: friendship.createdAt,
    };
  });

  res.status(200).json(friends);
});

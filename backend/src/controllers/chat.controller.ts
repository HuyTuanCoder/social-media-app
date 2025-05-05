import { Request, Response } from 'express';
import prisma from '../db';
import asyncHandler from '../utils/asyncHandler';

// Create a chat message
export const createChatMessage = asyncHandler(async (req: Request, res: Response) => {
  const { senderId, receiverId, text } = req.body;

  // Validate input
  if (!senderId || !receiverId || !text) {
    return res.status(400).json({ error: 'senderId, receiverId, and text are required' });
  }

  // Check if a chat already exists between the two users
  let chat = await prisma.chat.findFirst({
    where: {
      OR: [
        { userAId: senderId, userBId: receiverId },
        { userAId: receiverId, userBId: senderId },
      ],
    },
  });

  // If no chat exists, create a new one
  if (!chat) {
    chat = await prisma.chat.create({
      data: {
        userAId: senderId,
        userBId: receiverId,
      },
    });
  }

  // Add the message to the Message table
  const message = await prisma.message.create({
    data: {
      chatId: chat.id,
      senderId,
      text,
    },
  });

  res.status(201).json({ message: 'Message sent successfully', chatDetails: chat, messageDetails: message });
});

// Retrieve chat messages between two users
export const getChatMessages = asyncHandler(async (req: Request, res: Response) => {
  const { userAId, userBId } = req.query;

  // Validate input
  if (!userAId || !userBId) {
    return res.status(400).json({ error: 'userAId and userBId are required' });
  }

  // Find the chat between the two users
  const chat = await prisma.chat.findFirst({
    where: {
      OR: [
        { userAId: userAId as string, userBId: userBId as string },
        { userAId: userBId as string, userBId: userAId as string },
      ],
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc', // Sort messages by creation time
        },
      },
    },
  });

  if (!chat) {
    return res.status(404).json({ error: 'No chat found between the specified users' });
  }

  res.status(200).json({ chat });
});

// Delete a chat message
export const deleteChatMessage = asyncHandler(async (req: Request, res: Response) => {
  const { messageId } = req.body;

  // Validate input
  if (!messageId) {
    return res.status(400).json({ error: 'messageId is required' });
  }

  // Check if the message exists
  // This is the workflow needed by Prisma otherwise it will throw an error if we simply call delete
  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }

  // Delete the message
  await prisma.message.delete({
    where: { id: messageId },
  });

  res.status(200).json({ message: 'Message deleted successfully' });
});

// Fetch all chat relationships for a user
export const getUserChats = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.query;

  // Validate input
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  // Fetch all chats where the user is either userA or userB
  const chats = await prisma.chat.findMany({
    where: {
      OR: [{ userAId: userId as string }, { userBId: userId as string }],
    },
    include: {
      userA: { select: { id: true, username: true } },
      userB: { select: { id: true, username: true } },
    },
  });

  res.status(200).json({ chats });
});
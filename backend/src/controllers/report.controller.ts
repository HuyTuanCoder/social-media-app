import { Request, Response } from 'express';
import prisma from '../db';
import asyncHandler from '../utils/asyncHandler';

export const generateReport = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Call the stored procedure
    await prisma.$executeRawUnsafe(`CALL GenerateReport('${userId}')`);
    
    // Fetch the results
    const reportResults = await prisma.$queryRaw<{
      totalUsers: bigint | null;
      totalFriends: bigint | null;
      totalMessagesSent: bigint | null;
      mostMessagedUser: string | null;
      mostMessagedBy: string | null;
    }[]>`
      SELECT 
        @totalUsers AS totalUsers, 
        @totalFriends AS totalFriends, 
        @totalMessagesSent AS totalMessagesSent, 
        @mostMessagedUser AS mostMessagedUser, 
        @mostMessagedBy AS mostMessagedBy
    `;
    
    // Extract the first row and handle BigInt serialization
    const rawResult = reportResults[0];
    
    // Custom serialization for the response
    const result = {
      totalUsers: rawResult.totalUsers ? Number(rawResult.totalUsers) : 0,
      totalFriends: rawResult.totalFriends ? Number(rawResult.totalFriends) : 0,
      totalMessagesSent: rawResult.totalMessagesSent ? Number(rawResult.totalMessagesSent) : 0,
      mostMessagedUser: rawResult.mostMessagedUser || '',
      mostMessagedBy: rawResult.mostMessagedBy || ''
    };
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ 
      error: 'Failed to generate report', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});
import { PrismaClient } from '@prisma/client';

// Connect to Prisma
const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  console.log('Connected to Prisma');
}

// Function to connect to the database
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to Prisma');
  } catch (error) {
    console.error('Error connecting to Prisma:', error);
    process.exit(1); // Exit the process if the connection fails
  }
};


export default prisma;
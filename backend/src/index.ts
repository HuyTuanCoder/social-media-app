import app from './app';
import { connectDB } from './db';

const PORT = process.env.PORT || 3000;

// Connect to Prisma
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
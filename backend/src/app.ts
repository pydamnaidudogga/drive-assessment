import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import draftRoutes from './routes/draftRoutes';
import driveRoutes from './routes/driveRoutes';
// import errorHandler from './utils/errorHandler';

dotenv.config();

const app: Express = express();
const PORT: string | number = process.env.PORT || 5000;

// Middleware
app.use(cors({ 
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err: Error) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drafts', draftRoutes);
app.use('/api/drive', driveRoutes);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
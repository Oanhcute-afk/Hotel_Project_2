import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import reviewsRoutes from './routes/reviews.js';
import managerRoutes from './routes/manager.js';
import commentsRoutes from './routes/comments.js';

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/comments', commentsRoutes);

// MongoDB connection
mongoose.set('bufferCommands', false);
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 // 5 seconds timeout
})
  .then(() => console.log('Connected to MongoDB Atlas successfully!'))
  .catch((err) => {
    console.error('CRITICAL: MongoDB connection has failed!');
    console.error('Error details:', err.message);
    console.error('URI being used:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 25) + '...' : 'UNDEFINED');
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

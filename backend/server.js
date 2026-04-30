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

// Các Middleware
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Các Tuyến đường (Routes)
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

// Kết nối MongoDB
mongoose.set('bufferCommands', false);
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 // Hết hạn sau 5 giây
})
  .then(() => console.log('Kết nối thành công với MongoDB Atlas!'))
  .catch((err) => {
    console.error('LỖI NGHIÊM TRỌNG: Kết nối MongoDB thất bại!');
    console.error('Chi tiết lỗi:', err.message);
  });

app.listen(PORT, () => {
  console.log(`Máy chủ đang chạy tại cổng ${PORT}`);
});

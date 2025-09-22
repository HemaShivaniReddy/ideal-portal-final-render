import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import ideaRoutes from './routes/ideas.js';
import forumRoutes from './routes/forum.js';

dotenv.config();
const app = express();

// ✅ CORS: allow only your Vercel frontend
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

// ✅ Connect DB
connectDB();

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Ideal Portal Backend OK' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/forum', forumRoutes);

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

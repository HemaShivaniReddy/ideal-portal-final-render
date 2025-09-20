import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import ideaRoutes from './routes/ideas.js';
import forumRoutes from './routes/forum.js';

dotenv.config();
const app = express();

// ✅ Allow requests from your Vercel frontend
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "https://ideal-portal-final-render.vercel.app",
  credentials: true
}));

app.use(express.json());

connectDB();

app.get('/', (req, res) => res.json({ status: 'Ideal Portal Backend OK' }));

app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/forum', forumRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

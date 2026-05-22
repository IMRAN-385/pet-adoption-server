import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import petRoutes from './routes/petRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://pet-adoption-client-eta.vercel.app/'
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/requests', requestRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Pet Adoption Backend is running...');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.log('❌ Server Error:', error.message);
  }
};

startServer();
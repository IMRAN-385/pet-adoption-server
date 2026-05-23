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

// 🔥 Best CORS Configuration
const allowedOrigins = [
'http://localhost:3000',
'https://pet-adoption-client-eta.vercel.app',
];
app.use(
cors({
origin: (origin, callback) => {
if (!origin || allowedOrigins.includes(origin)) {
callback(null, true);
} else {
callback(new Error('Not allowed by CORS'));
}
},
credentials: true,
})
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/requests', requestRoutes);

app.get('/', (req, res) => {
  res.send('✅ Pet Adoption Backend is running...');
});

app.get('/api/test-cors', (req, res) => {
  res.json({ 
    success: true, 
    message: 'CORS is working!', 
    origin: req.headers.origin 
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server Error:', error.message);
  }
};

startServer();
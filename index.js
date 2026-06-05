import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import connectDB from './config/db.js';
import petRoutes from './routes/petRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://pet-adoption-client-eta.vercel.app',
  'https://pet-adoption-client.vercel.app',
  'https://pet-adoption-client-cw7p2th9p-imran-385s-projects.vercel.app',
  'https://pet-adoption-client-git-main-imran-385s-projects.vercel.app',
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })
);

app.set('trust proxy', 1);

app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto']) {
    req.headers['x-forwarded-proto'] = req.headers['x-forwarded-proto'].split(',')[0].trim();
  }
  next();
});

app.all('/api/auth/{*path}', toNodeHandler(auth));

app.use(express.json());
app.use(cookieParser());

app.use('/api/pets', petRoutes);
app.use('/api/requests', requestRoutes);

app.get('/', (req, res) => {
  res.send('✅ Pet Adoption Backend is running...');
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
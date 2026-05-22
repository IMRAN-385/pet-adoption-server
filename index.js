import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

import authRoutes from './routes/authRoutes.js';
import petRoutes from './routes/petRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

// ── Middleware ──
app.use(cors({
  origin: [
    'http://localhost:5173',
     'https://pet-adoption-client-eta.vercel.app/',
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ── MongoDB ──
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log('✅ MongoDB Connected!');

    const db = client.db('petAdoptionDB');
    const petsCollection     = db.collection('pets');
    const requestsCollection = db.collection('requests');
    const usersCollection    = db.collection('users');

    // Inject collections into req via middleware
    app.use((req, res, next) => {
      req.petsCollection     = petsCollection;
      req.requestsCollection = requestsCollection;
      req.usersCollection    = usersCollection;
      next();
    });

    // ── Routes ──
    app.use('/api/auth',     authRoutes);
    app.use('/api/pets',     petRoutes);
    app.use('/api/requests', requestRoutes);

    app.get('/', (req, res) => {
      res.send('🐾 PawsHome Server is Running!');
    });

    // ── Start server ──
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });

  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
}

run();
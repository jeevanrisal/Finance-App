import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

import userRoutes from './routers/userRoutes.js';
app.use('/api/users', userRoutes); // Connect user routes

const PORT = process.env.PORT || 8880;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// server.ts
import express from 'express';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cookieParser());

// Define Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5555;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app; 
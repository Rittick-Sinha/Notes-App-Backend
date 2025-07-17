import express  from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import userRouter from './routes/userRoutes';
import authRoutes from './routes/auth';
import noteRoutes from './routes/noteRoutes';

dotenv.config();
connectDB();
const app = express();

app.use(express.json());

// Add CORS middleware
const allowedOrigins = ['https://notes-app-frontend-teal-six.vercel.app/'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRouter);
app.use('/api/notes', noteRoutes);
app.get('/',(req, res)=>{
    res.send('API is running...');
});

// Use PORT instead of PORT_URL
const PORT = process.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log(`Server is running at PORT : ${PORT}`);
});
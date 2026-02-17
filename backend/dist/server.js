import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { configureCloudinary } from './config/cloudinary';
import { logger } from './shared/utils/logger';
import authRoutes from './routes/authRoutes';
import galleryRoutes from './routes/galleryRoutes';
import { errorHandler } from './middlewares/errorMiddleware';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Connect to Database and start server
connectDB().then(() => {
    configureCloudinary();
    // Middleware
    app.use(cors());
    app.use(express.json());
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/gallery', galleryRoutes);
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
    // Global Error Handler
    app.use(errorHandler);
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
}).catch(error => {
    logger.error('Failed to connect to the database:', error);
    process.exit(1);
});

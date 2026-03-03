import express, { Express, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import ApiError from './utils/ApiError';

const app: Express = express();

// Security Middlewares
app.use(helmet());

// CORS configuration (adjust origin as needed for production)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request validation and parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (using morgan)
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Serve public files (like css and js)
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/', routes); 

// 404 handler for unknown routes
app.use((req: Request, res: Response, next) => {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;

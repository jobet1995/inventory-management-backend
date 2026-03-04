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
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS Configuration (Dynamic Origin to allow credentials from any origin)
const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow all origins by echoing them back
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range', 'Content-Disposition', 'Content-Length', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Request validation and parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (using morgan)
app.use(morgan('dev'));

// Serve System Diagnostics page
app.get('/health', (req: Request, res: Response) => {
  res.sendFile(path.resolve(process.cwd(), 'public/health.html'));
});

// Serve Admin Control Panel
app.get('/admin', (req: Request, res: Response) => {
  res.sendFile(path.resolve(process.cwd(), 'public/admin.html'));
});

// Serve Admin Login
app.get('/login', (req: Request, res: Response) => {
  res.sendFile(path.resolve(process.cwd(), 'public/login.html'));
});

// Serve public files (like css and js)
const publicPath = path.resolve(process.cwd(), 'public');
app.use(express.static(publicPath));

// API Routes
app.use('/api', routes); 

// 404 handler for unknown routes
app.use((req: Request, res: Response, next) => {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;

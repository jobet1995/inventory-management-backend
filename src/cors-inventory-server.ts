import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';

// ==========================================
// Types & Interfaces
// ==========================================

export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
}

export interface ErrorResponse {
    status: number;
    message: string;
}

// ==========================================
// In-Memory Database Simulation
// ==========================================

let inventory: InventoryItem[] = [
    { id: '1', name: 'Laptop', quantity: 50 },
    { id: '2', name: 'Wireless Mouse', quantity: 150 },
    { id: '3', name: 'Mechanical Keyboard', quantity: 75 }
];

// ==========================================
// App Initialization
// ==========================================

const app = express();
const PORT = process.env.PORT || 4000;

// ==========================================
// Setup CORS Configuration
// ==========================================

const allowedOrigins = ['**'];

// Middleware to log blocked CORS requests explicitly (before the cors package handles it)
app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (origin && !allowedOrigins.includes(origin)) {
        console.warn(`[CORS WARN] Blocked request from unauthorized origin: ${origin}`);
    }
    next();
});

const corsOptions: CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (e.g. mobile apps, curl requests) or if origin is in whitelist
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies and authorization headers
    optionsSuccessStatus: 204
};

// Apply standard Express Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// ==========================================
// Inventory Routes
// ==========================================

const inventoryRouter = express.Router();

// GET all items
inventoryRouter.get('/', (req: Request, res: Response) => {
    res.status(200).json({ data: inventory });
});

// POST a new item
inventoryRouter.post('/', (req: Request<{}, {}, Omit<InventoryItem, 'id'>>, res: Response, next: NextFunction) => {
    try {
        const { name, quantity } = req.body;
        
        if (!name || quantity === undefined) {
             throw { status: 400, message: 'Name and quantity are required' };
        }

        const newItem: InventoryItem = {
            id: Date.now().toString(),
            name,
            quantity: Number(quantity)
        };
        
        inventory.push(newItem);
        res.status(201).json({ message: 'Item created successfully', data: newItem });
    } catch (err) {
        next(err);
    }
});

// PUT (update) an item
inventoryRouter.put('/:id', (req: Request<{id: string}, {}, Partial<Omit<InventoryItem, 'id'>>>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, quantity } = req.body;
        
        const itemIndex = inventory.findIndex(item => item.id === id);
        if (itemIndex === -1) {
            throw { status: 404, message: `Item with id ${id} not found` };
        }

        const updatedItem = {
            ...inventory[itemIndex],
            ...(name && { name }),
            ...(quantity !== undefined && { quantity: Number(quantity) })
        };

        inventory[itemIndex] = updatedItem;
        res.status(200).json({ message: 'Item updated successfully', data: updatedItem });
    } catch (err) {
        next(err);
    }
});

// DELETE an item
inventoryRouter.delete('/:id', (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const initialLength = inventory.length;
        
        inventory = inventory.filter(item => item.id !== id);
        
        if (inventory.length === initialLength) {
            throw { status: 404, message: `Item with id ${id} not found` };
        }
        
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        next(err);
    }
});

// Mount router
app.use('/api/inventory', inventoryRouter);

// ==========================================
// Global Error Handler
// ==========================================

app.use((err: any, req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
    const status = err.status || 500;
    // Specifically catch CORS errors from the cors package
    const message = err.message === 'Not allowed by CORS' 
        ? 'Cross-Origin Resource Sharing (CORS) policy blocked this request'
        : err.message || 'Internal Server Error';

    res.status(status).json({
        status,
        message
    });
});

// ==========================================
// Start Server
// ==========================================

export const startServer = () => {
    app.listen(PORT, () => {
        console.log(`🚀 Production Server is running on http://localhost:${PORT}`);
        console.log(`CORS whitelist enabled for: ${allowedOrigins.join(', ')}`);
    });
};

// Start the server if this file is run directly
if (require.main === module) {
    startServer();
}

export default app;

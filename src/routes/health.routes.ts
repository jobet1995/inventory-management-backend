import { Router } from 'express';
import { getSystemHealth } from '../controllers/health.controller';

const router = Router();

// Route: GET /api/health
router.get('/', getSystemHealth);

export default router;

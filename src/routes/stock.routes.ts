import { Router } from 'express';
import * as stockController from '../controllers/stock.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as stockValidator from '../validators/stock.validator';
import { authorize } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', stockController.getStocks);
router.post('/adjust', authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF), validate(stockValidator.stockAdjustmentSchema), stockController.adjustStock);
router.get('/movements', stockController.getStockMovements);

router.get('/:id', stockController.getStockById);

export default router;

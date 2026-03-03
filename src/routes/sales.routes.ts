import { Router } from 'express';
import * as salesController from '../controllers/sales.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as salesValidator from '../validators/sales.validator';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(salesController.getSalesOrders)
  .post(validate(salesValidator.createSalesOrderSchema), salesController.createSalesOrder);

router.route('/:id')
  .get(validate(salesValidator.getSalesOrderSchema), salesController.getSalesOrderById)
  .put(validate(salesValidator.updateSalesOrderStatusSchema), salesController.updateSalesOrderStatus);

export default router;

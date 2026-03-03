import { Router } from 'express';
import * as salesController from '../controllers/sales.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as salesValidator from '../validators/sales.validator';
import { authorize } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF, Role.ACCOUNTANT), salesController.getSalesOrders)
  .post(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF), validate(salesValidator.createSalesOrderSchema), salesController.createSalesOrder);

router.route('/:id')
  .get(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF, Role.ACCOUNTANT), validate(salesValidator.getSalesOrderSchema), salesController.getSalesOrderById)
  .put(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF), validate(salesValidator.updateSalesOrderStatusSchema), salesController.updateSalesOrderStatus);

export default router;

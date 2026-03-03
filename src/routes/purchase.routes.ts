import { Router } from 'express';
import * as purchaseController from '../controllers/purchase.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as purchaseValidator from '../validators/purchase.validator';
import { authorize } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF, Role.ACCOUNTANT), purchaseController.getPurchaseOrders)
  .post(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF), validate(purchaseValidator.createPurchaseOrderSchema), purchaseController.createPurchaseOrder);

router.route('/:id')
  .get(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF, Role.ACCOUNTANT), validate(purchaseValidator.getPurchaseOrderSchema), purchaseController.getPurchaseOrderById)
  .put(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF), validate(purchaseValidator.updatePurchaseOrderStatusSchema), purchaseController.updateOrderStatus);

export default router;

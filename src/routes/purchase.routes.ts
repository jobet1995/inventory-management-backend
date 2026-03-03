import { Router } from 'express';
import * as purchaseController from '../controllers/purchase.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as purchaseValidator from '../validators/purchase.validator';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(purchaseController.getPurchaseOrders)
  .post(validate(purchaseValidator.createPurchaseOrderSchema), purchaseController.createPurchaseOrder);

router.route('/:id')
  .get(validate(purchaseValidator.getPurchaseOrderSchema), purchaseController.getPurchaseOrderById)
  .put(validate(purchaseValidator.updatePurchaseOrderStatusSchema), purchaseController.updateOrderStatus);

export default router;

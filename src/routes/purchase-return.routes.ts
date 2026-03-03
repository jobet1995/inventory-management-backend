import { Router } from 'express';
import * as purchaseReturnController from '../controllers/purchase-return.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import * as purchaseReturnValidator from '../validators/purchase-return.validator';
import { AuditLogAction, AuditLogEntity } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(purchaseReturnController.getPurchaseReturns)
  .post(
    validate(purchaseReturnValidator.createPurchaseReturnSchema),
    auditLog(AuditLogAction.CREATE, AuditLogEntity.PURCHASE_RETURN),
    purchaseReturnController.createPurchaseReturn
  );

router.route('/:id')
  .get(purchaseReturnController.getPurchaseReturnById)
  .put(
    validate(purchaseReturnValidator.updatePurchaseReturnStatusSchema),
    auditLog(AuditLogAction.UPDATE, AuditLogEntity.PURCHASE_RETURN),
    purchaseReturnController.updatePurchaseReturnStatus
  )
  .delete(
    auditLog(AuditLogAction.DELETE, AuditLogEntity.PURCHASE_RETURN),
    purchaseReturnController.deletePurchaseReturn
  );

export default router;

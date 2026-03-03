import { Router } from 'express';
import * as purchaseReturnController from '../controllers/purchase-return.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import * as purchaseReturnValidator from '../validators/purchase-return.validator';
import { AuditLogAction, AuditLogEntity, Role } from '@prisma/client';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF, Role.ACCOUNTANT), purchaseReturnController.getPurchaseReturns)
  .post(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF),
    validate(purchaseReturnValidator.createPurchaseReturnSchema),
    auditLog(AuditLogAction.CREATE, AuditLogEntity.PURCHASE_RETURN),
    purchaseReturnController.createPurchaseReturn
  );

router.route('/:id')
  .get(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF, Role.ACCOUNTANT), purchaseReturnController.getPurchaseReturnById)
  .put(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF),
    validate(purchaseReturnValidator.updatePurchaseReturnStatusSchema),
    auditLog(AuditLogAction.UPDATE, AuditLogEntity.PURCHASE_RETURN),
    purchaseReturnController.updatePurchaseReturnStatus
  )
  .delete(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF),
    auditLog(AuditLogAction.DELETE, AuditLogEntity.PURCHASE_RETURN),
    purchaseReturnController.deletePurchaseReturn
  );

export default router;

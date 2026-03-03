import { Router } from 'express';
import * as salesReturnController from '../controllers/sales-return.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import * as salesReturnValidator from '../validators/sales-return.validator';
import { AuditLogAction, AuditLogEntity, Role } from '@prisma/client';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF, Role.ACCOUNTANT), salesReturnController.getSalesReturns)
  .post(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF),
    validate(salesReturnValidator.createSalesReturnSchema),
    auditLog(AuditLogAction.CREATE, AuditLogEntity.SALES_RETURN),
    salesReturnController.createSalesReturn
  );

router.route('/:id')
  .get(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF, Role.ACCOUNTANT), salesReturnController.getSalesReturnById)
  .put(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF),
    validate(salesReturnValidator.updateSalesReturnStatusSchema),
    auditLog(AuditLogAction.UPDATE, AuditLogEntity.SALES_RETURN),
    salesReturnController.updateSalesReturnStatus
  )
  .delete(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF),
    auditLog(AuditLogAction.DELETE, AuditLogEntity.SALES_RETURN),
    salesReturnController.deleteSalesReturn
  );

export default router;

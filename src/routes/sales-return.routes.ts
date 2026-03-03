import { Router } from 'express';
import * as salesReturnController from '../controllers/sales-return.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import * as salesReturnValidator from '../validators/sales-return.validator';
import { AuditLogAction, AuditLogEntity } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(salesReturnController.getSalesReturns)
  .post(
    validate(salesReturnValidator.createSalesReturnSchema),
    auditLog(AuditLogAction.CREATE, AuditLogEntity.SALES_RETURN),
    salesReturnController.createSalesReturn
  );

router.route('/:id')
  .get(salesReturnController.getSalesReturnById)
  .put(
    validate(salesReturnValidator.updateSalesReturnStatusSchema),
    auditLog(AuditLogAction.UPDATE, AuditLogEntity.SALES_RETURN),
    salesReturnController.updateSalesReturnStatus
  )
  .delete(
    auditLog(AuditLogAction.DELETE, AuditLogEntity.SALES_RETURN),
    salesReturnController.deleteSalesReturn
  );

export default router;

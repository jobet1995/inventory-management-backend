import { Router } from 'express';
import * as taxRateController from '../controllers/tax-rate.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import * as taxRateValidator from '../validators/tax-rate.validator';
import { AuditLogAction, AuditLogEntity, Role } from '@prisma/client';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(taxRateController.getTaxRates)
  .post(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT),
    validate(taxRateValidator.createTaxRateSchema),
    auditLog(AuditLogAction.CREATE, AuditLogEntity.TAX_RATE),
    taxRateController.createTaxRate
  );

router.route('/:id')
  .get(taxRateController.getTaxRateById)
  .put(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT),
    validate(taxRateValidator.updateTaxRateSchema),
    auditLog(AuditLogAction.UPDATE, AuditLogEntity.TAX_RATE),
    taxRateController.updateTaxRate
  )
  .delete(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT),
    auditLog(AuditLogAction.DELETE, AuditLogEntity.TAX_RATE),
    taxRateController.deleteTaxRate
  );

export default router;

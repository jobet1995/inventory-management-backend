import { Router } from 'express';
import * as taxRateController from '../controllers/tax-rate.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import * as taxRateValidator from '../validators/tax-rate.validator';
import { AuditLogAction, AuditLogEntity } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(taxRateController.getTaxRates)
  .post(
    validate(taxRateValidator.createTaxRateSchema),
    auditLog(AuditLogAction.CREATE, AuditLogEntity.TAX_RATE),
    taxRateController.createTaxRate
  );

router.route('/:id')
  .get(taxRateController.getTaxRateById)
  .put(
    validate(taxRateValidator.updateTaxRateSchema),
    auditLog(AuditLogAction.UPDATE, AuditLogEntity.TAX_RATE),
    taxRateController.updateTaxRate
  )
  .delete(
    auditLog(AuditLogAction.DELETE, AuditLogEntity.TAX_RATE),
    taxRateController.deleteTaxRate
  );

export default router;

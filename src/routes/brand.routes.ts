import { Router } from 'express';
import * as brandController from '../controllers/brand.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import * as brandValidator from '../validators/brand.validator';
import { AuditLogAction, AuditLogEntity } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(brandController.getBrands)
  .post(
    validate(brandValidator.createBrandSchema),
    auditLog(AuditLogAction.CREATE, AuditLogEntity.BRAND),
    brandController.createBrand
  );

router.route('/:id')
  .get(brandController.getBrandById)
  .put(
    validate(brandValidator.updateBrandSchema),
    auditLog(AuditLogAction.UPDATE, AuditLogEntity.BRAND),
    brandController.updateBrand
  )
  .delete(
    auditLog(AuditLogAction.DELETE, AuditLogEntity.BRAND),
    brandController.deleteBrand
  );

export default router;

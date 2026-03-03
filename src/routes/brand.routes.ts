import { Router } from 'express';
import * as brandController from '../controllers/brand.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import * as brandValidator from '../validators/brand.validator';
import { AuditLogAction, AuditLogEntity, Role } from '@prisma/client';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(brandController.getBrands)
  .post(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER),
    validate(brandValidator.createBrandSchema),
    auditLog(AuditLogAction.CREATE, AuditLogEntity.BRAND),
    brandController.createBrand
  );

router.route('/:id')
  .get(brandController.getBrandById)
  .put(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER),
    validate(brandValidator.updateBrandSchema),
    auditLog(AuditLogAction.UPDATE, AuditLogEntity.BRAND),
    brandController.updateBrand
  )
  .delete(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER),
    auditLog(AuditLogAction.DELETE, AuditLogEntity.BRAND),
    brandController.deleteBrand
  );

export default router;

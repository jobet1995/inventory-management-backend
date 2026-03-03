import { Router } from 'express';
import * as unitController from '../controllers/unit.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import * as unitValidator from '../validators/unit.validator';
import { AuditLogAction, AuditLogEntity, Role } from '@prisma/client';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(unitController.getUnits)
  .post(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER),
    validate(unitValidator.createUnitSchema),
    auditLog(AuditLogAction.CREATE, AuditLogEntity.UNIT),
    unitController.createUnit
  );

router.route('/:id')
  .get(unitController.getUnitById)
  .put(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER),
    validate(unitValidator.updateUnitSchema),
    auditLog(AuditLogAction.UPDATE, AuditLogEntity.UNIT),
    unitController.updateUnit
  )
  .delete(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER),
    auditLog(AuditLogAction.DELETE, AuditLogEntity.UNIT),
    unitController.deleteUnit
  );

export default router;

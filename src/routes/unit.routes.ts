import { Router } from 'express';
import * as unitController from '../controllers/unit.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import * as unitValidator from '../validators/unit.validator';
import { AuditLogAction, AuditLogEntity } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(unitController.getUnits)
  .post(
    validate(unitValidator.createUnitSchema),
    auditLog(AuditLogAction.CREATE, AuditLogEntity.UNIT),
    unitController.createUnit
  );

router.route('/:id')
  .get(unitController.getUnitById)
  .put(
    validate(unitValidator.updateUnitSchema),
    auditLog(AuditLogAction.UPDATE, AuditLogEntity.UNIT),
    unitController.updateUnit
  )
  .delete(
    auditLog(AuditLogAction.DELETE, AuditLogEntity.UNIT),
    unitController.deleteUnit
  );

export default router;

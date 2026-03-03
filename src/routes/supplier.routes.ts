import { Router } from 'express';
import * as supplierController from '../controllers/supplier.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as supplierValidator from '../validators/supplier.validator';
import { authorize } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(supplierController.getSuppliers)
  .post(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER), validate(supplierValidator.createSupplierSchema), supplierController.createSupplier);

router.route('/:id')
  .get(supplierController.getSupplierById)
  .put(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER), validate(supplierValidator.updateSupplierSchema), supplierController.updateSupplier)
  .delete(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER), supplierController.deleteSupplier);

export default router;

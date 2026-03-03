import { Router } from 'express';
import * as supplierController from '../controllers/supplier.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as supplierValidator from '../validators/supplier.validator';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(supplierController.getSuppliers)
  .post(validate(supplierValidator.createSupplierSchema), supplierController.createSupplier);

router.route('/:id')
  .get(supplierController.getSupplierById)
  .put(validate(supplierValidator.updateSupplierSchema), supplierController.updateSupplier)
  .delete(supplierController.deleteSupplier);

export default router;

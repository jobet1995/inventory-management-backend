import { Router } from 'express';
import * as invoiceController from '../controllers/invoice.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as invoiceValidator from '../validators/invoice.validator';
import { authorize } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT), invoiceController.getInvoices)
  .post(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT), validate(invoiceValidator.createInvoiceSchema), invoiceController.createInvoice);

router.route('/:id')
  .get(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT), invoiceController.getInvoiceById)
  .put(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT), validate(invoiceValidator.updateInvoiceStatusSchema), invoiceController.updateInvoiceStatus)
  .delete(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT), invoiceController.deleteInvoice);

export default router;

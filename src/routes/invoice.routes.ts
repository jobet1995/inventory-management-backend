import { Router } from 'express';
import * as invoiceController from '../controllers/invoice.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as invoiceValidator from '../validators/invoice.validator';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(invoiceController.getInvoices)
  .post(validate(invoiceValidator.createInvoiceSchema), invoiceController.createInvoice);

router.route('/:id')
  .get(invoiceController.getInvoiceById)
  .put(validate(invoiceValidator.updateInvoiceStatusSchema), invoiceController.updateInvoiceStatus)
  .delete(invoiceController.deleteInvoice);

export default router;

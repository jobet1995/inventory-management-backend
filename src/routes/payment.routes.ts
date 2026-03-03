import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as paymentValidator from '../validators/payment.validator';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(paymentController.getPayments)
  .post(validate(paymentValidator.createPaymentSchema), paymentController.processPayment);

router.get('/:id', paymentController.getPaymentById);

export default router;

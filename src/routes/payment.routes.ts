import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as paymentValidator from '../validators/payment.validator';
import { authorize } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT), paymentController.getPayments)
  .post(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT), validate(paymentValidator.createPaymentSchema), paymentController.processPayment);

router.get('/:id', authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT), paymentController.getPaymentById);

export default router;

import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as customerValidator from '../validators/customer.validator';
import { authorize } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF, Role.ACCOUNTANT), customerController.getCustomers)
  .post(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF), validate(customerValidator.createCustomerSchema), customerController.createCustomer);

router.route('/:id')
  .get(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF, Role.ACCOUNTANT), customerController.getCustomerById)
  .put(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF), validate(customerValidator.updateCustomerSchema), customerController.updateCustomer)
  .delete(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF), customerController.deleteCustomer);

export default router;

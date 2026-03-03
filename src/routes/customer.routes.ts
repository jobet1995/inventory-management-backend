import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as customerValidator from '../validators/customer.validator';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(customerController.getCustomers)
  .post(validate(customerValidator.createCustomerSchema), customerController.createCustomer);

router.route('/:id')
  .get(customerController.getCustomerById)
  .put(validate(customerValidator.updateCustomerSchema), customerController.updateCustomer)
  .delete(customerController.deleteCustomer);

export default router;

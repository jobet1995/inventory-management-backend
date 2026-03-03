import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as userValidator from '../validators/user.validator';

const router = Router();

// Protect all routes
router.use(authenticate);

router.route('/')
  .get(userController.getUsers)
  .post(validate(userValidator.createUserSchema), userController.createUser);

router.route('/:id')
  .get(userController.getUserById)
  .put(validate(userValidator.updateUserSchema), userController.updateUser)
  .delete(userController.deleteUser);

export default router;

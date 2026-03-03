import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as categoryValidator from '../validators/category.validator';
import { authorize } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Category routes are generally viewable by any authenticated user
router.get('/', authenticate, categoryController.getCategories);
router.get('/:id', authenticate, categoryController.getCategoryById);

// But modification requires authentication and authorization
const modifierRoles = [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER];
router.post('/', authenticate, authorize(...modifierRoles), validate(categoryValidator.createCategorySchema), categoryController.createCategory);
router.put('/:id', authenticate, authorize(...modifierRoles), validate(categoryValidator.updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', authenticate, authorize(...modifierRoles), categoryController.deleteCategory);

export default router;

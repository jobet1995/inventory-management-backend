import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as categoryValidator from '../validators/category.validator';

const router = Router();

// Category routes are generally viewable by any authenticated user
router.get('/', authenticate, categoryController.getCategories);
router.get('/:id', authenticate, categoryController.getCategoryById);

// But modification requires authentication
router.post('/', authenticate, validate(categoryValidator.createCategorySchema), categoryController.createCategory);
router.put('/:id', authenticate, validate(categoryValidator.updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', authenticate, categoryController.deleteCategory);

export default router;

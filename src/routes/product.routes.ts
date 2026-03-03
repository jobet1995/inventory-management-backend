import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as productValidator from '../validators/product.validator';
import { authorize } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Apply authentication to all product routes
router.use(authenticate);

router.route('/')
  .get(productController.getProducts)
  .post(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER),
    validate(productValidator.createProductSchema),
    productController.createProduct
  );

router.route('/:id')
  .get(
    validate(productValidator.getProductSchema),
    productController.getProductById
  )
  .put(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER),
    validate(productValidator.updateProductSchema),
    productController.updateProduct
  )
  .delete(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER),
    validate(productValidator.getProductSchema),
    productController.deleteProduct
  );

export default router;

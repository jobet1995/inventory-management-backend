import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as productValidator from '../validators/product.validator';

const router = Router();

// Apply authentication to all product routes
router.use(authenticate);

router.route('/')
  .get(productController.getProducts)
  .post(
    validate(productValidator.createProductSchema),
    productController.createProduct
  );

router.route('/:id')
  .get(
    validate(productValidator.getProductSchema),
    productController.getProductById
  )
  .put(
    validate(productValidator.updateProductSchema),
    productController.updateProduct
  )
  .delete(
    validate(productValidator.getProductSchema),
    productController.deleteProduct
  );

export default router;

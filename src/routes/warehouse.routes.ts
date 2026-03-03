import { Router } from 'express';
import * as warehouseController from '../controllers/warehouse.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as warehouseValidator from '../validators/warehouse.validator';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(warehouseController.getWarehouses)
  .post(validate(warehouseValidator.createWarehouseSchema), warehouseController.createWarehouse);

router.route('/:id')
  .get(warehouseController.getWarehouseById)
  .put(validate(warehouseValidator.updateWarehouseSchema), warehouseController.updateWarehouse)
  .delete(warehouseController.deleteWarehouse);

export default router;

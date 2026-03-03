import { Router } from 'express';
import * as warehouseController from '../controllers/warehouse.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as warehouseValidator from '../validators/warehouse.validator';
import { authorize } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(warehouseController.getWarehouses)
  .post(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER), validate(warehouseValidator.createWarehouseSchema), warehouseController.createWarehouse);

router.route('/:id')
  .get(warehouseController.getWarehouseById)
  .put(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER), validate(warehouseValidator.updateWarehouseSchema), warehouseController.updateWarehouse)
  .delete(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER), warehouseController.deleteWarehouse);

export default router;

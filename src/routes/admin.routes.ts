import { Router } from 'express';
import { getModels, getSchema, getAllData, getOneData, createData, updateData, deleteData, executeQuery } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Secure all admin routes unconditionally
router.use(authenticate);
router.use(authorize(Role.SUPER_ADMIN));

// Get list of all models
router.get('/models', getModels);

// Raw Database Query Console
// Raw Database Query Console
router.post('/query', executeQuery);

// Get Schema for a specific model
router.get('/schema/:modelName', getSchema);

// Generic Schema CRUD
router.get('/:modelName', getAllData);
router.get('/:modelName/:id', getOneData);
router.post('/:modelName', createData);
router.put('/:modelName/:id', updateData);
router.delete('/:modelName/:id', deleteData);

export default router;

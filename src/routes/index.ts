import { Router } from 'express';
import path from 'path';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';
import supplierRoutes from './supplier.routes';
import purchaseRoutes from './purchase.routes';
import salesRoutes from './sales.routes';
import stockRoutes from './stock.routes';
import customerRoutes from './customer.routes';
import invoiceRoutes from './invoice.routes';
import paymentRoutes from './payment.routes';
import warehouseRoutes from './warehouse.routes';
import brandRoutes from './brand.routes';
import unitRoutes from './unit.routes';
import taxRateRoutes from './tax-rate.routes';
import salesReturnRoutes from './sales-return.routes';
import purchaseReturnRoutes from './purchase-return.routes';

const router = Router();

console.log('🛣️ Initializing API routes...');

// Mount Authentication routes
router.use('/auth', authRoutes);

// Root route for API Landing Page
router.get(['/', ''], (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Mount routes
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/sales', salesRoutes);
router.use('/stocks', stockRoutes);
router.use('/customers', customerRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/payments', paymentRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/brands', brandRoutes);
router.use('/units', unitRoutes);
router.use('/tax-rates', taxRateRoutes);
router.use('/sales-returns', salesReturnRoutes);
router.use('/purchase-returns', purchaseReturnRoutes);

export default router;

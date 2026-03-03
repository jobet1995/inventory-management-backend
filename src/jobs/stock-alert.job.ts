import prisma from '../config/database';
import { logger } from '../config/logger';

export const checkLowStock = async () => {
  try {
    logger.info('Running low stock alert job...');
    
    // Find all stock entries where the quantity is at or below the reorder level
    const lowStocks = await prisma.stock.findMany({
      where: {
        quantity: {
          lte: prisma.stock.fields.reorderLevel
        }
      },
      include: {
        product: true,
        warehouse: true
      }
    });

    if (lowStocks.length > 0) {
      logger.warn(`Found ${lowStocks.length} products with low stock!`);
      // In a real-world scenario, you might send an email or push notification here.
      lowStocks.forEach((stock: any) => {
        logger.warn(`- ${stock.product.name} at ${stock.warehouse.name} is low (Current: ${stock.quantity}, Reorder Level: ${stock.reorderLevel})`);
      });
    } else {
      logger.info('Stock levels are healthy.');
    }

  } catch (error) {
    logger.error('Failed to run low stock alert job', { error });
  }
};

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const supplier = await prisma.supplier.findFirst();
  const product = await prisma.product.findFirst();
  const user = await prisma.user.findFirst();
  
  console.log('Supplier:', supplier?.id);
  console.log('Product:', product?.id);
  console.log('User:', user?.id);
  
  await prisma.$disconnect();
}

main().catch(console.error);

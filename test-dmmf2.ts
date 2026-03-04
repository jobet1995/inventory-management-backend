import { Prisma } from '@prisma/client';
console.log('DMMF available:', !!Prisma.dmmf);
if (Prisma.dmmf) {
  console.log('Models:', Prisma.dmmf.datamodel.models.map(m => m.name).join(', '));
  console.log('Enums:', Prisma.dmmf.datamodel.enums.map(e => e.name).join(', '));
} else {
  console.log('DMMF is undefined!');
}

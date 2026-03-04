import { Prisma } from '@prisma/client';
console.log(Prisma.dmmf ? 'exists' : 'missing', Prisma.dmmf?.datamodel?.models?.map(m => m.name));

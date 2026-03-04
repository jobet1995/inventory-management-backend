import prisma from '../src/config/database';
import bcrypt from 'bcryptjs';

async function main() {
  const adminEmail = 'admin@coreengine.com';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (existing) {
    console.log('Super Admin already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await prisma.user.create({
    data: {
      firstName: 'System',
      lastName: 'Administrator',
      email: adminEmail,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    }
  });
  
  console.log('✅ Super Admin created: admin@coreengine.com / password123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

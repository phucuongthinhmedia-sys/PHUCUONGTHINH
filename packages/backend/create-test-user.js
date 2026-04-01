const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Creating test user...');

  const hashedPassword = await bcrypt.hash('test123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {
      password_hash: hashedPassword,
    },
    create: {
      email: 'test@test.com',
      password_hash: hashedPassword,
      role: 'admin',
    },
  });

  console.log('✅ Test user ready!');
  console.log('📝 Email: test@test.com');
  console.log('📝 Password: test123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

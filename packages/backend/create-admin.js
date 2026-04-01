const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin@123', 10);

  const user = await prisma.user.create({
    data: {
      email: 'admin@phucuongthinh.net',
      password_hash: hashedPassword,
      role: 'admin',
    },
  });

  console.log('✅ Created admin user:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

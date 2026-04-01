const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin@123', 10);

  const user = await prisma.user.update({
    where: { email: 'admin@phucuongthinh.net' },
    data: {
      password_hash: hashedPassword,
    },
  });

  console.log('✅ Updated admin password:', user.email);
  console.log('📝 New password: admin@123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

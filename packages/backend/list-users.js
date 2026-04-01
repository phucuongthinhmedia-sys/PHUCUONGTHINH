const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();

  console.log('📋 All users in database:');
  users.forEach((user) => {
    console.log(`  - Email: ${user.email}, Role: ${user.role}`);
  });

  if (users.length === 0) {
    console.log('  (No users found)');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

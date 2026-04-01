const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'test@test.com';
  const password = 'test123';

  console.log('Testing login for:', email);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log('❌ User not found!');
    return;
  }

  console.log('✅ User found:', user.email);
  console.log('Password hash:', user.password_hash.substring(0, 20) + '...');

  const isValid = await bcrypt.compare(password, user.password_hash);
  console.log('Password valid:', isValid ? '✅ YES' : '❌ NO');

  if (!isValid) {
    console.log('\nTrying to create new hash...');
    const newHash = await bcrypt.hash(password, 10);
    console.log('New hash:', newHash.substring(0, 20) + '...');

    await prisma.user.update({
      where: { email },
      data: { password_hash: newHash },
    });
    console.log('✅ Password updated! Try login again.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

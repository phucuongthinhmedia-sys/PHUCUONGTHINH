const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const users = [
  { name: 'thinh', email: 'thinh@phucuongthinh.com', password: 'thinh@123' },
  { name: 'trinh', email: 'trinh@phucuongthinh.com', password: 'trinh@123' },
  { name: 'lan', email: 'lan@phucuongthinh.com', password: 'lan@123' },
  { name: 'hang', email: 'hang@phucuongthinh.com', password: 'hang@123' },
  { name: 'phuc', email: 'phuc@phucuongthinh.com', password: 'phuc@123' },
];

async function createUsers() {
  console.log('🔧 Bắt đầu tạo tài khoản...\n');

  for (const user of users) {
    try {
      // Kiểm tra xem user đã tồn tại chưa
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        console.log(`⚠️  User ${user.email} đã tồn tại, bỏ qua...`);
        continue;
      }

      // Hash mật khẩu
      const hashedPassword = await bcrypt.hash(user.password, 12);

      // Tạo user mới
      const newUser = await prisma.user.create({
        data: {
          email: user.email,
          password_hash: hashedPassword,
          role: 'admin',
        },
      });

      console.log(`✅ Đã tạo user: ${user.email}`);
      console.log(`   - Mật khẩu: ${user.password}`);
      console.log(`   - Role: admin\n`);
    } catch (error) {
      console.error(`❌ Lỗi khi tạo user ${user.email}:`, error.message);
    }
  }

  console.log('\n📋 Tổng kết tài khoản đã tạo:');
  console.log('─'.repeat(50));

  const allUsers = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
      created_at: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  allUsers.forEach((user, index) => {
    console.log(`${index + 1}. ${user.email} (${user.role})`);
  });

  console.log('─'.repeat(50));
  console.log(`\n✨ Hoàn tất! Tổng số user: ${allUsers.length}`);
}

createUsers()
  .catch((error) => {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

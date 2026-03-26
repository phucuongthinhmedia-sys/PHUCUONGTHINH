#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function setup() {
  console.log('🚀 Starting production setup...\n');

  try {
    // Test database connection
    console.log('1️⃣ Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected\n');

    // Run migrations
    console.log('2️⃣ Running migrations...');
    const { execSync } = require('child_process');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migrations completed\n');

    // Check if data exists
    console.log('3️⃣ Checking existing data...');
    const productCount = await prisma.product.count();
    const userCount = await prisma.user.count();

    if (productCount > 0 && userCount > 0) {
      console.log(
        `✅ Database already has ${productCount} products and ${userCount} users`,
      );
      console.log('⏭️  Skipping seed\n');
      return;
    }

    // Seed data
    console.log('4️⃣ Seeding database...');

    // Create admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@phucuongthinh.com' },
      update: {},
      create: {
        email: 'admin@phucuongthinh.com',
        password_hash: hashedPassword,
        role: 'admin',
      },
    });
    console.log('  ✓ Admin user created');

    // Create categories
    const gach = await prisma.category.upsert({
      where: { slug: 'gach' },
      update: {},
      create: { name: 'Gạch', slug: 'gach' },
    });

    const gachLatNen = await prisma.category.upsert({
      where: { slug: 'gach-lat-nen' },
      update: {},
      create: {
        name: 'Gạch Lát Nền',
        slug: 'gach-lat-nen',
        parent_id: gach.id,
      },
    });

    const gachOpTuong = await prisma.category.upsert({
      where: { slug: 'gach-op-tuong' },
      update: {},
      create: {
        name: 'Gạch Ốp Tường',
        slug: 'gach-op-tuong',
        parent_id: gach.id,
      },
    });
    console.log('  ✓ Categories created');

    // Create styles
    const styleNames = ['Hiện đại', 'Tối giản', 'Công nghiệp', 'Cổ điển'];
    for (const name of styleNames) {
      await prisma.style.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }
    console.log('  ✓ Styles created');

    // Create spaces
    const spaceNames = ['Phòng Khách', 'Phòng Ngủ', 'Nhà Bếp', 'Phòng Tắm'];
    for (const name of spaceNames) {
      await prisma.space.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }
    console.log('  ✓ Spaces created');

    // Create products
    const products = [
      {
        name: 'Gạch Porcelain Lát Nền 60x60 - Trắng Sáng',
        sku: 'GACH-FLOOR-001',
        description:
          'Gạch porcelain cao cấp với bề mặt bóng sang trọng, độ bền vượt trội. Phù hợp cho phòng khách, phòng ngủ, văn phòng.',
        category_id: gachLatNen.id,
        technical_specs: JSON.stringify({
          kich_thuoc: '600 x 600 x 10 mm',
          chat_lieu: 'Porcelain',
          mau_sac: 'Trắng sáng',
          xuat_xu: 'Việt Nam',
          bao_hanh: '5 năm',
        }),
        is_published: true,
      },
      {
        name: 'Gạch Porcelain Giả Gỗ 80x20 - Nâu Ấm',
        sku: 'GACH-FLOOR-002',
        description:
          'Gạch porcelain giả gỗ tự nhiên, mang lại cảm giác ấm cúng. Chống trơn tốt, dễ vệ sinh.',
        category_id: gachLatNen.id,
        technical_specs: JSON.stringify({
          kich_thuoc: '800 x 200 x 10 mm',
          chat_lieu: 'Porcelain',
          mau_sac: 'Nâu ấm',
          xuat_xu: 'Việt Nam',
          bao_hanh: '5 năm',
        }),
        is_published: true,
      },
      {
        name: 'Gạch Ốp Tường Phòng Tắm 30x60 - Trắng',
        sku: 'GACH-WALL-001',
        description:
          'Gạch ốp tường phòng tắm với bề mặt bóng, chống ẩm mốc tốt, dễ vệ sinh.',
        category_id: gachOpTuong.id,
        technical_specs: JSON.stringify({
          kich_thuoc: '300 x 600 x 8 mm',
          chat_lieu: 'Ceramic',
          mau_sac: 'Trắng',
          xuat_xu: 'Việt Nam',
          bao_hanh: '3 năm',
        }),
        is_published: true,
      },
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { sku: product.sku },
        update: {},
        create: product,
      });
    }
    console.log(`  ✓ ${products.length} products created\n`);

    console.log('✅ Setup completed successfully!\n');
    console.log('📝 Admin credentials:');
    console.log('   Email: admin@phucuongthinh.com');
    console.log('   Password: admin123\n');
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setup();

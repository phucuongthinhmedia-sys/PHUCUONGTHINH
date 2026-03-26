const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Cleaning database...');

  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.style.deleteMany({});
  await prisma.space.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅ Database cleaned');
  console.log('🌱 Seeding...');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@phucuongthinh.com',
      password_hash: hashedPassword,
      role: 'admin',
    },
  });

  const tilesCategory = await prisma.category.create({
    data: { name: 'Gạch', slug: 'gach' },
  });

  const floorTilesCategory = await prisma.category.create({
    data: {
      name: 'Gạch Lát Nền',
      slug: 'gach-lat-nen',
      parent_id: tilesCategory.id,
    },
  });

  const wallTilesCategory = await prisma.category.create({
    data: {
      name: 'Gạch Ốp Tường',
      slug: 'gach-op-tuong',
      parent_id: tilesCategory.id,
    },
  });

  await prisma.style.createMany({
    data: [
      { name: 'Hiện đại' },
      { name: 'Tối giản' },
      { name: 'Công nghiệp' },
      { name: 'Cổ điển' },
    ],
  });

  await prisma.space.createMany({
    data: [
      { name: 'Phòng Khách' },
      { name: 'Phòng Ngủ' },
      { name: 'Nhà Bếp' },
      { name: 'Phòng Tắm' },
    ],
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'Gạch Porcelain Lát Nền 60x60 - Trắng Sáng',
        sku: 'GACH-FLOOR-001',
        description: 'Gạch porcelain cao cấp với bề mặt bóng sang trọng.',
        category_id: floorTilesCategory.id,
        technical_specs: JSON.stringify({
          kich_thuoc: '600x600x10mm',
          chat_lieu: 'Porcelain',
        }),
        is_published: true,
      },
      {
        name: 'Gạch Porcelain Giả Gỗ 80x20 - Nâu Ấm',
        sku: 'GACH-FLOOR-002',
        description: 'Gạch giả gỗ tự nhiên, ấm cúng.',
        category_id: floorTilesCategory.id,
        technical_specs: JSON.stringify({
          kich_thuoc: '800x200x10mm',
          chat_lieu: 'Porcelain',
        }),
        is_published: true,
      },
      {
        name: 'Gạch Ốp Tường 30x60 - Trắng',
        sku: 'GACH-WALL-001',
        description: 'Gạch ốp tường phòng tắm.',
        category_id: wallTilesCategory.id,
        technical_specs: JSON.stringify({
          kich_thuoc: '300x600x8mm',
          chat_lieu: 'Ceramic',
        }),
        is_published: true,
      },
    ],
  });

  console.log('✅ Seeded 3 products');
  console.log('📝 Admin: admin@phucuongthinh.com / admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

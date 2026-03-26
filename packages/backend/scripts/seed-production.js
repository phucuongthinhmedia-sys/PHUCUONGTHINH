const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding production database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@phucuongthinh.com' },
    update: {},
    create: {
      email: 'admin@phucuongthinh.com',
      password_hash: hashedPassword,
      role: 'admin',
    },
  });
  console.log('✅ Created admin user:', adminUser.email);

  // Create categories
  const tilesCategory = await prisma.category.upsert({
    where: { slug: 'gach' },
    update: {},
    create: { name: 'Gạch', slug: 'gach' },
  });

  const floorTilesCategory = await prisma.category.upsert({
    where: { slug: 'gach-lat-nen' },
    update: {},
    create: {
      name: 'Gạch Lát Nền',
      slug: 'gach-lat-nen',
      parent_id: tilesCategory.id,
    },
  });

  console.log('✅ Created categories');

  // Create styles
  const styles = ['Hiện đại', 'Tối giản', 'Công nghiệp'];
  for (const styleName of styles) {
    await prisma.style.upsert({
      where: { name: styleName },
      update: {},
      create: { name: styleName },
    });
  }
  console.log('✅ Created styles');

  // Create spaces
  const spaces = ['Phòng Khách', 'Phòng Ngủ', 'Nhà Bếp'];
  for (const spaceName of spaces) {
    await prisma.space.upsert({
      where: { name: spaceName },
      update: {},
      create: { name: spaceName },
    });
  }
  console.log('✅ Created spaces');

  // Create sample product
  const product = await prisma.product.upsert({
    where: { sku: 'GACH-DEMO-001' },
    update: {},
    create: {
      name: 'Gạch Porcelain Lát Nền 60x60 - Trắng Sáng',
      sku: 'GACH-DEMO-001',
      description:
        'Gạch porcelain cao cấp với bề mặt bóng sang trọng, độ bền vượt trội.',
      category_id: floorTilesCategory.id,
      technical_specs: JSON.stringify({
        kich_thuoc: '600 x 600 x 10 mm',
        chat_lieu: 'Porcelain',
        mau_sac: 'Trắng sáng',
        xuat_xu: 'Việt Nam',
      }),
      is_published: true,
    },
  });
  console.log('✅ Created sample product:', product.name);

  console.log('🎉 Production seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * Seed document categories if they don't exist
 * Run: node scripts/seed-document-categories.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  { id: 'cat_co_cq', name: 'CO/CQ', code: 'CO_CQ' },
  { id: 'cat_sale', name: 'Chứng từ bán hàng', code: 'SALE_DOCS' },
  { id: 'cat_fulfill', name: 'Chứng từ giao nhận', code: 'FULFILLMENT_DOCS' },
  { id: 'cat_internal', name: 'Chứng từ nội bộ', code: 'INTERNAL' },
];

async function main() {
  for (const cat of categories) {
    await prisma.documentCategory.upsert({
      where: { code: cat.code },
      update: { name: cat.name },
      create: { id: cat.id, name: cat.name, code: cat.code },
    });
    console.log(`✅ ${cat.name}`);
  }
  console.log('Done.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

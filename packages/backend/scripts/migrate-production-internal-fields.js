#!/usr/bin/env node
/**
 * Script to migrate product_internals table on production
 * Adds missing fields that exist in schema but not in database
 *
 * Usage: node scripts/migrate-production-internal-fields.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Starting migration for product_internals table...');

  try {
    // Read the migration SQL file
    const fs = require('fs');
    const path = require('path');
    const migrationPath = path.join(
      __dirname,
      '../prisma/migrations/20260331000000_add_product_internal_fields/migration.sql',
    );

    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration SQL loaded');
    console.log('🚀 Executing migration...');

    // Execute the migration
    await prisma.$executeRawUnsafe(migrationSQL);

    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('The following fields have been added to product_internals:');
    console.log('  - price_retail');
    console.log('  - price_wholesale');
    console.log('  - wholesale_discount_tiers');
    console.log('  - price_dealer');
    console.log('  - price_promo');
    console.log('  - promo_start_date');
    console.log('  - promo_end_date');
    console.log('  - promo_note');
    console.log('  - warehouse_location');
    console.log('  - stock_status');
    console.log('  - stock_quantity');
    console.log('  - supplier_phone (renamed from supplier_contact if needed)');
    console.log('');
    console.log('✨ You can now use the internal product features!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

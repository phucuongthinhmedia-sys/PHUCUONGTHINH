/*
  Warnings:

  - You are about to drop the `content_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `extracted_products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `import_jobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_internals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_levels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `warehouses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `alt_text` on the `media` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "content_items_is_published_idx";

-- DropIndex
DROP INDEX "content_items_type_idx";

-- DropIndex
DROP INDEX "extracted_products_validation_status_idx";

-- DropIndex
DROP INDEX "extracted_products_import_job_id_idx";

-- DropIndex
DROP INDEX "import_jobs_created_at_idx";

-- DropIndex
DROP INDEX "import_jobs_status_idx";

-- DropIndex
DROP INDEX "import_jobs_user_id_idx";

-- DropIndex
DROP INDEX "inventory_records_created_at_idx";

-- DropIndex
DROP INDEX "inventory_records_warehouse_id_idx";

-- DropIndex
DROP INDEX "inventory_records_product_id_idx";

-- DropIndex
DROP INDEX "product_internals_product_id_key";

-- DropIndex
DROP INDEX "stock_levels_product_id_warehouse_id_key";

-- DropIndex
DROP INDEX "stock_levels_warehouse_id_idx";

-- DropIndex
DROP INDEX "stock_levels_product_id_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "content_items";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "extracted_products";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "import_jobs";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "inventory_records";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "product_internals";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "stock_levels";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "warehouses";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "file_size" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "media_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_media" ("created_at", "file_size", "file_type", "file_url", "id", "is_cover", "media_type", "product_id", "sort_order", "updated_at") SELECT "created_at", "file_size", "file_type", "file_url", "id", "is_cover", "media_type", "product_id", "sort_order", "updated_at" FROM "media";
DROP TABLE "media";
ALTER TABLE "new_media" RENAME TO "media";
CREATE INDEX "media_product_id_idx" ON "media"("product_id");
CREATE INDEX "media_media_type_idx" ON "media"("media_type");
CREATE INDEX "media_sort_order_idx" ON "media"("sort_order");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

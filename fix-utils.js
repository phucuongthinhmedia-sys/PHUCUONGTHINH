const fs = require('fs');

let pfu = fs.readFileSync('./packages/frontend/src/components/admin/product-form-utils.tsx', 'utf8');
pfu = `import { PendingMedia } from "@/components/admin/media-uploader";\nimport { MediaRecord } from "@/lib/media-service";\n` + pfu;
fs.writeFileSync('./packages/frontend/src/components/admin/product-form-utils.tsx', pfu);


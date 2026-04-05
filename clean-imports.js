const fs = require('fs');

// Clean product-form.tsx
let pf = fs.readFileSync('./packages/frontend/src/components/admin/product-form.tsx', 'utf8');
pf = pf.replace(/import {[^}]*Category[^}]*} from "@\/lib\/category-service";/, '');
pf = pf.replace(/import {[^}]*Tag[^}]*} from "@\/lib\/tag-service";/, '');
pf = pf.replace(/AlertCircle,\n  CheckCircle2,\n/, '');
fs.writeFileSync('./packages/frontend/src/components/admin/product-form.tsx', pf);

// Clean product-form-utils.tsx
let pfu = fs.readFileSync('./packages/frontend/src/components/admin/product-form-utils.tsx', 'utf8');
pfu = pfu.replace(/import { CategoryPicker } from "@\/components\/admin\/category-picker";/, '');
pfu = pfu.replace(/import { MediaUploader, PendingMedia } from "@\/components\/admin\/media-uploader";/, '');
pfu = pfu.replace(/import {\n  InternalInfoSection,\n  InternalInfoData,\n} from "@\/components\/admin\/internal-info-section";/, '');
pfu = pfu.replace(/import { SpecTable } from "@\/components\/admin\/spec-table";/, '');
pfu = pfu.replace(/import { ProductType, detectProductType } from "@\/lib\/spec-templates";/, '');
pfu = pfu.replace(/import {\n  uploadMedia,\n  createMediaRecord,\n  deleteMedia,\n  updateSortOrder,\n  MediaRecord,\n} from "@\/lib\/media-service";/, '');
pfu = pfu.replace(/import { apiClient } from "@\/lib\/api-client";/, '');
pfu = pfu.replace(/import { realtimeService } from "@\/lib\/realtime-service";/, '');
pfu = pfu.replace(/import { invalidateProductMediaCache } from "@\/lib\/cache-utils";/, '');
pfu = pfu.replace(/Save,\n  Copy,\n  Eye,\n  ChevronDown,\n/, '');
fs.writeFileSync('./packages/frontend/src/components/admin/product-form-utils.tsx', pfu);

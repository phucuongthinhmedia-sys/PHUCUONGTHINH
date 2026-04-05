const fs = require('fs');
const path = './packages/frontend/src/components/admin/product-form.tsx';

let content = fs.readFileSync(path, 'utf8');
content = content.replace('FormState', 'FormState,\n  ProductFormProps,\n  BADGES');
fs.writeFileSync(path, content);

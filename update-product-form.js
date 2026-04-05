const fs = require('fs');
const path = './packages/frontend/src/components/admin/product-form.tsx';

let content = fs.readFileSync(path, 'utf8');

// Replace the top part with imports
const startLine = 'function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {';
const endLine = 'export function ProductForm({';

const startIndex = content.indexOf(startLine);
const endIndex = content.indexOf(endLine);

if (startIndex !== -1 && endIndex !== -1) {
  const imports = `import {
  debounce,
  toSlug,
  withRetry,
  formatApiError,
  safeApiCall,
  initFormData,
  Field,
  Card,
  Input,
  Textarea,
  Toast,
  FormState
} from './product-form-utils';

`;
  
  content = content.slice(0, startIndex) + imports + content.slice(endIndex);
  fs.writeFileSync(path, content);
  console.log('product-form.tsx updated successfully');
} else {
  console.log('Could not find start or end index');
}

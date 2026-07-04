const fs = require('fs');

const fixForms = (file) => {
  let code = fs.readFileSync(file, 'utf-8');
  // replace formData.get('something') with (formData.get('something') as string)
  code = code.replace(/formData\.get\('([^']+)'\)/g, "(formData.get('$1') as string)");
  fs.writeFileSync(file, code);
};

fixForms('src/components/FinanceView.tsx');
fixForms('src/components/InventoryView.tsx');
fixForms('src/components/SalesView.tsx');
// HRView also has a form, let's fix it too just in case.
fixForms('src/components/HRView.tsx');


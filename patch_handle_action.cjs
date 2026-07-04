const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');

code = code.replace(
  "window.dispatchEvent(new Event('refetch-' + endpoint));",
  "window.dispatchEvent(new Event('refetch-' + endpoint));\n        window.dispatchEvent(new Event('refetch-dashboard-stats'));"
);

fs.writeFileSync('src/components/DashboardView.tsx', code);

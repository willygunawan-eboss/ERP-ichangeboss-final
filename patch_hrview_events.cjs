const fs = require('fs');
let code = fs.readFileSync('src/components/HRView.tsx', 'utf-8');

code = code.replace(
  "alert('Employee added successfully!'); window.dispatchEvent(new Event('refetch-employees')); window.dispatchEvent(new Event('refetch-attendance')); window.dispatchEvent(new Event('refetch-payroll'));",
  "alert('Employee added successfully!'); window.dispatchEvent(new Event('refetch-employees')); window.dispatchEvent(new Event('refetch-attendance')); window.dispatchEvent(new Event('refetch-payroll')); window.dispatchEvent(new Event('refetch-dashboard-stats'));"
);

fs.writeFileSync('src/components/HRView.tsx', code);

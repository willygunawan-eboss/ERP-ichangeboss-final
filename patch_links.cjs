const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');

code = code.replace(
  'onClick={() => { if (link.name === "Add Employee" && onNavigate) onNavigate("hr"); else if (link.name === "Company Settings" && onNavigate) onNavigate("settings"); }}',
  'onClick={() => { if (onNavigate) { if (link.name.includes("Employee") || link.name === "My Info") onNavigate("hr"); else onNavigate("settings"); } }}'
);

fs.writeFileSync('src/components/DashboardView.tsx', code);

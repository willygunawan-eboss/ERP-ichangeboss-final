import fs from 'fs';

let header = fs.readFileSync('src/components/Header.tsx', 'utf-8');
header = header.replace(/ArrowLeftLeft/g, 'ArrowLeft');
fs.writeFileSync('src/components/Header.tsx', header);

let dashboard = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');
dashboard = dashboard.replace(/import { Clock/g, "import { LayoutGrid, User, Clock");
fs.writeFileSync('src/components/DashboardView.tsx', dashboard);
console.log('Fixed');

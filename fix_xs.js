import fs from 'fs';

// Header.tsx
let header = fs.readFileSync('src/components/Header.tsx', 'utf-8');
header = header.replace(/hidden xs:block/g, "hidden sm:block");
fs.writeFileSync('src/components/Header.tsx', header);

// DashboardView.tsx
let dashboard = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');
dashboard = dashboard.replace(/xs:grid-cols-3/g, "grid-cols-3");
dashboard = dashboard.replace(/xs:grid-cols-2/g, "grid-cols-2");
fs.writeFileSync('src/components/DashboardView.tsx', dashboard);

console.log('Fixed xs breakpoint');

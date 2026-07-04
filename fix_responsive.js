import fs from 'fs';

// App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace(/<div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full transition-all duration-300">/, `<div className="flex-1 md:pl-64 flex flex-col h-screen overflow-hidden transition-all duration-300 w-full relative">`);
fs.writeFileSync('src/App.tsx', app);

// Header.tsx
let header = fs.readFileSync('src/components/Header.tsx', 'utf-8');
// Fix gap on mobile for header
header = header.replace(/<div className="flex items-center gap-3 sm:gap-8">/, `<div className="flex items-center gap-2 sm:gap-8">`);
header = header.replace(/<span className="font-black text-slate-800 tracking-tight text-xl group-hover:text-slate-900 transition-colors uppercase">ichangeboss<\/span>/, `<span className="font-black text-slate-800 tracking-tight text-lg sm:text-xl group-hover:text-slate-900 transition-colors uppercase hidden xs:block">ichangeboss</span>`);
// Show inbox and search on mobile again but compactly
header = header.replace(/<button className="hidden sm:flex p-2\.5/g, `<button className="flex p-2 sm:p-2.5`);
fs.writeFileSync('src/components/Header.tsx', header);

// DashboardView.tsx
let dashboard = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');
dashboard = dashboard.replace(/<div className="flex flex-col h-full max-w-7xl mx-auto w-full p-6 space-y-6">/, `<div className="flex flex-col h-full max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">`);
dashboard = dashboard.replace(/grid grid-cols-3 sm:grid-cols-5 gap-4/g, "grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4");
dashboard = dashboard.replace(/<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-4">/g, `<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">`);
dashboard = dashboard.replace(/<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">/, `<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">`);
fs.writeFileSync('src/components/DashboardView.tsx', dashboard);

console.log('Responsive fixes applied');

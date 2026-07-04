import fs from 'fs';

// 1. Update App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace(/const \[activeModule, setActiveModule\] = useState<ModuleId>\('dashboard'\);/, `const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');\n  const [isSidebarOpen, setIsSidebarOpen] = useState(false);`);
app = app.replace(/<Sidebar activeModule=\{activeModule\} onNavigate=\{setActiveModule\} \/>/, `<Sidebar activeModule={activeModule} onNavigate={(id) => { setActiveModule(id); setIsSidebarOpen(false); }} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />`);
app = app.replace(/<div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">/, `<div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full transition-all duration-300">`);
app = app.replace(/<Header \/>/, `<Header onMenuClick={() => setIsSidebarOpen(true)} />`);
fs.writeFileSync('src/App.tsx', app);

// 2. Update Sidebar.tsx
let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
sidebar = sidebar.replace(/interface SidebarProps \{[\s\S]*?\}/, `interface SidebarProps {\n  activeModule: ModuleId;\n  onNavigate: (moduleId: ModuleId) => void;\n  isOpen?: boolean;\n  setIsOpen?: (isOpen: boolean) => void;\n}`);
sidebar = sidebar.replace(/export function Sidebar\(\{ activeModule, onNavigate \}: SidebarProps\) \{/, `export function Sidebar({ activeModule, onNavigate, isOpen = false, setIsOpen }: SidebarProps) {`);
sidebar = sidebar.replace(/<aside className="w-64 bg-\[#142338\] text-slate-300 h-screen fixed left-0 top-0 flex flex-col z-20 font-sans transition-all relative">/, `<>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen?.(false)}
        />
      )}
      <aside className={cn(
        "w-64 bg-[#142338] text-slate-300 h-screen fixed left-0 top-0 flex flex-col z-50 font-sans transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>`);
// Add closing fragment tag
sidebar = sidebar.replace(/<\/aside>\s*\);\s*\}/, `</aside>\n    </>\n  );\n}`);
fs.writeFileSync('src/components/Sidebar.tsx', sidebar);

// 3. Update Header.tsx
let header = fs.readFileSync('src/components/Header.tsx', 'utf-8');
header = header.replace(/export function Header\(\) \{/, `export function Header({ onMenuClick }: { onMenuClick?: () => void }) {`);
header = header.replace(/<header className="h-\[72px\] bg-white border-b border-slate-200\/80 flex items-center justify-between px-6 sticky top-0 z-50 shrink-0 shadow-sm backdrop-blur-md bg-white\/95">/, `<header className="h-[72px] bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shrink-0 shadow-sm backdrop-blur-md bg-white/95">`);
// Add Menu button
header = header.replace(/<div className="flex items-center gap-8">/, `<div className="flex items-center gap-3 sm:gap-8">\n        <button onClick={onMenuClick} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl md:hidden">\n          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>\n        </button>`);
// Hide items on mobile
header = header.replace(/className="hidden md:flex items-center bg-slate-100\/80 p-1\.5 rounded-lg border border-slate-200\/50"/, `className="hidden lg:flex items-center bg-slate-100/80 p-1.5 rounded-lg border border-slate-200/50"`);
// Adjust gap in right section
header = header.replace(/<div className="flex items-center gap-4">/, `<div className="flex items-center gap-1.5 sm:gap-4">`);
// Hide Inbox, search, etc. on small screens if necessary
header = header.replace(/<button className="p-2\.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-all duration-200 hover:shadow-sm relative">/g, `<button className="hidden sm:flex p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-all duration-200 hover:shadow-sm relative">`);
header = header.replace(/<button className="p-2\.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-all duration-200 hover:shadow-sm">/g, `<button className="hidden sm:flex p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-all duration-200 hover:shadow-sm">`);
// Fix the divider
header = header.replace(/<div className="h-8 w-px bg-slate-200\/80 mx-2"><\/div>/, `<div className="hidden sm:block h-8 w-px bg-slate-200/80 mx-2"></div>`);
fs.writeFileSync('src/components/Header.tsx', header);

// 4. Update DashboardView.tsx (Responsive classes)
let dashboard = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');
dashboard = dashboard.replace(/grid grid-cols-2 sm:grid-cols-4 gap-4/g, "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-4");
fs.writeFileSync('src/components/DashboardView.tsx', dashboard);

console.log('Mobile fixes applied');

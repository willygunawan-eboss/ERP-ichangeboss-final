import React from 'react';
import { LayoutDashboard, Users, ShoppingCart, Briefcase, CreditCard, Box, MoreHorizontal, ChevronRight, Settings, FileText, Database, HeadphonesIcon, BarChart3, BookOpen, Wrench, FileArchive, Calculator } from 'lucide-react';
import { ModuleId } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeModule: ModuleId;
  onNavigate: (moduleId: ModuleId) => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

const navItems: { id: ModuleId; label: string; icon: React.ElementType; hasSubmenu?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'crm', label: 'CRM & Leads', icon: Users, hasSubmenu: true },
  { id: 'sales', label: 'Penjualan (Sales)', icon: ShoppingCart, hasSubmenu: true },
  { id: 'purchase', label: 'Pengadaan (Purchase)', icon: Briefcase, hasSubmenu: true },
  { id: 'inventory', label: 'Inventaris (Inventory)', icon: Box, hasSubmenu: true },
  { id: 'asset', label: 'Manajemen Aset', icon: Database, hasSubmenu: true },
  { id: 'project', label: 'Manajemen Proyek', icon: Briefcase, hasSubmenu: true },
  { id: 'field_service', label: 'Layanan Lapangan', icon: Wrench, hasSubmenu: true },
  { id: 'helpdesk', label: 'Helpdesk & Tiket', icon: HeadphonesIcon, hasSubmenu: true },
  { id: 'finance', label: 'Keuangan & Akuntansi', icon: Calculator, hasSubmenu: true },
  { id: 'invoicing', label: 'Faktur (Invoicing)', icon: FileText, hasSubmenu: true },
  { id: 'hr', label: 'SDM & Payroll', icon: Users, hasSubmenu: true },
  { id: 'bi', label: 'Business Intelligence', icon: BarChart3, hasSubmenu: true },
  { id: 'dms', label: 'Document Management', icon: FileArchive, hasSubmenu: true },
  { id: 'kb', label: 'Knowledge Base', icon: BookOpen, hasSubmenu: true },
];

export function Sidebar({ activeModule, onNavigate, isOpen = false, setIsOpen }: SidebarProps) {
  return (
    <>
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
      )}>
      {/* Subtle background texture/stars to mimic the image */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1.5px, transparent 1.5px)', backgroundSize: '150px 150px' }}></div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden flex justify-center items-center">
         <div className="w-96 h-96 bg-blue-400 rounded-full blur-[100px]"></div>
      </div>

      <div className="h-16 flex items-center px-6 relative z-10 pt-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center relative overflow-hidden shrink-0">
             <div className="absolute bottom-0 right-0 w-4 h-4 bg-white/20 rounded-tl-full"></div>
             <span className="text-white font-bold text-xs">I</span>
          </div>
          <div>
            <h1 className="text-white font-bold tracking-widest text-base truncate">ICHANGEBOSS</h1>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 px-3 custom-scrollbar relative z-10">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-all duration-200 group",
                  isActive 
                    ? "bg-white/10 text-white font-semibold" 
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-[18px] h-[18px]", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300")} />
                  <span className="text-[13px]">{item.label}</span>
                </div>
                {item.hasSubmenu && (
                   <ChevronRight className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="mt-6 mb-4">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
            Administration
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group",
              activeModule === 'settings'
                ? "bg-white/10 text-white font-semibold" 
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <Settings className={cn("w-[18px] h-[18px]", activeModule === 'settings' ? "text-white" : "text-slate-400 group-hover:text-slate-300")} />
            <span className="text-[13px]">System Settings</span>
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { HRView } from './components/HRView';
import { FinanceView } from './components/FinanceView';
import { SalesView } from './components/SalesView';
import { InventoryView } from './components/InventoryView';
import { ProjectsView } from './components/ProjectsView';
import { SettingsView } from './components/SettingsView';
import { CRMView } from './components/CRMView';
import { PurchaseView } from './components/PurchaseView';
import { AssetView } from './components/AssetView';
import { FieldServiceView } from './components/FieldServiceView';
import { HelpdeskView } from './components/HelpdeskView';
import { InvoicingView } from './components/InvoicingView';
import { BIView } from './components/BIView';
import { DMSView } from './components/DMSView';
import { KBView } from './components/KBView';
import { LoginView } from './components/LoginView';
import { ModuleId } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('erp_auth') === 'true';
  });
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('erp_auth', 'true');
    } else {
      localStorage.removeItem('erp_auth');
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };
  
  const handleLogoClick = () => {
    setActiveModule('dashboard');
    setRefreshKey(prev => prev + 1);
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardView onNavigate={setActiveModule} />;
      case 'finance':
        return <FinanceView />;
      case 'sales':
        return <SalesView />;
      case 'inventory':
        return <InventoryView />;
      case 'hr':
        return <HRView />;
      case 'project':
        return <ProjectsView />;
      case 'settings':
        return <SettingsView />;
      case 'crm':
        return <CRMView />;
      case 'purchase':
        return <PurchaseView />;
      case 'asset':
        return <AssetView />;
      case 'field_service':
        return <FieldServiceView />;
      case 'helpdesk':
        return <HelpdeskView />;
      case 'invoicing':
        return <InvoicingView />;
      case 'bi':
        return <BIView />;
      case 'dms':
        return <DMSView />;
      case 'kb':
        return <KBView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] text-slate-500 p-8">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-slate-300">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Module Under Development</h2>
            <p className="text-slate-500 max-w-md text-center">
              The <span className="font-semibold text-blue-600 capitalize">{activeModule}</span> module is currently being built for the ICHANGEBOSS ERP system. Please check back later.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar activeModule={activeModule} onNavigate={(id) => { setActiveModule(id); setIsSidebarOpen(false); }} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 md:pl-64 flex flex-col h-screen overflow-hidden transition-all duration-300 w-full relative">
        <Header onMenuClick={() => setIsSidebarOpen(true)} onLogout={handleLogout} onLogoClick={handleLogoClick} />
        <main key={refreshKey} className="flex-1 overflow-y-auto custom-scrollbar relative">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

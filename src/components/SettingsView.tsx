import React from 'react';
import { Save, Building2, UserCircle, Bell, Shield, Database, Webhook } from 'lucide-react';

export function SettingsView() {
  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto w-full">
      <div className="p-8 pb-0">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
            <p className="text-slate-500 mt-1 text-sm">Configure system preferences, company details, and integrations.</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-indigo-600/20 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl">
          {/* Settings Navigation */}
          <div className="w-full md:w-64 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-lg font-medium text-sm transition-colors">
              <Building2 className="w-5 h-5 text-indigo-600" />
              Company Details
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
              <UserCircle className="w-5 h-5 text-slate-400" />
              User Management
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
              <Bell className="w-5 h-5 text-slate-400" />
              Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
              <Shield className="w-5 h-5 text-slate-400" />
              Security & Roles
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
              <Database className="w-5 h-5 text-slate-400" />
              Database Backup
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
              <Webhook className="w-5 h-5 text-slate-400" />
              API Integrations
            </button>
          </div>

          {/* Settings Form */}
          <div className="flex-1 space-y-8">
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-900 mb-5 border-b border-slate-100 pb-3">Company Information</h3>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Company Name</label>
                    <input 
                      type="text" 
                      defaultValue="PT ICHANGEBOSS Gemilang"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Tax ID (NPWP)</label>
                    <input 
                      type="text" 
                      defaultValue="01.234.567.8-091.000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Headquarters Address</label>
                  <textarea 
                    rows={3}
                    defaultValue="Jl. Sudirman Kav 10-11, \nJakarta Pusat, 10220, \nIndonesia"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Primary Contact Email</label>
                    <input 
                      type="email" 
                      defaultValue="contact@ichangeboss.co.id"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                    <input 
                      type="tel" 
                      defaultValue="+62 21 555 1234"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-900 mb-5 border-b border-slate-100 pb-3">Regional Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Default Currency</label>
                  <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 font-medium">
                    <option value="IDR">IDR - Indonesian Rupiah</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="SGD">SGD - Singapore Dollar</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Timezone</label>
                  <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 font-medium">
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                    <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

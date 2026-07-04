import React, { useState, useEffect } from 'react';
import { LayoutGrid, User, Clock, ArrowRight, Link, Settings, UserPlus, Users, FileText, ChevronDown, Bell, Briefcase, Calendar, CheckCircle2, ChevronRight, BarChart3, PieChart } from 'lucide-react';

export function DashboardView({ onNavigate }: { onNavigate?: (id: any) => void }) {
  const [activeChart, setActiveChart] = useState('Employment Status');
  const [stats, setStats] = useState({
    activeEmployees: 0,
    totalDepartments: 0,
    openTickets: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    // Fetch real data from our backend
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStats(data.data);
      })
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      
      {/* Enterprise Overview Stats from Database */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Employees</span>
          <span className="text-2xl font-black text-indigo-600">{stats.activeEmployees}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Departments</span>
          <span className="text-2xl font-black text-emerald-600">{stats.totalDepartments}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Open Tickets</span>
          <span className="text-2xl font-black text-amber-500">{stats.openTickets}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Monthly Rev</span>
          <span className="text-2xl font-black text-blue-600">${stats.monthlyRevenue.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 10. Shortcut */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">Shortcut</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <button className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg border border-slate-100 transition-colors group">
                <Clock className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 mb-2" />
                <span className="text-xs font-semibold text-center text-slate-700 group-hover:text-indigo-700">Live attendance</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg border border-slate-100 transition-colors group">
                <FileText className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 mb-2" />
                <span className="text-xs font-semibold text-center text-slate-700 group-hover:text-indigo-700">Request benefit reimbursement</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg border border-slate-100 transition-colors group">
                <Calendar className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 mb-2" />
                <span className="text-xs font-semibold text-center text-slate-700 group-hover:text-indigo-700">Request time off</span>
              </button>
              <div className="relative">
                <button className="w-full flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-100 transition-colors">
                  <div className="w-6 h-6 flex items-center justify-center mb-2">
                    <span className="text-2xl font-black text-slate-400 leading-none">...</span>
                  </div>
                  <span className="text-xs font-semibold text-center text-slate-700">More Request</span>
                </button>
              </div>
            </div>
          </div>

          {/* 11. Chart */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-slate-800">Employment Insights</h3>
              <select 
                className="text-sm border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:border-indigo-500"
                value={activeChart}
                onChange={(e) => setActiveChart(e.target.value)}
              >
                <option>Employment Status</option>
                <option>Length of Service</option>
                <option>Job Level</option>
                <option>Gender Diversity</option>
              </select>
            </div>
            
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex flex-col items-center text-slate-400">
                <PieChart className="w-12 h-12 mb-3 opacity-50" />
                <span className="text-sm font-medium">{activeChart} Chart Visualization</span>
                <span className="text-xs mt-1">Data renders here</span>
              </div>
            </div>
          </div>

          {/* 14. Applications */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-base font-bold text-slate-800 mb-4">Applications</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
              {[
                { name: 'Forms', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
                { name: 'Performance Review', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { name: 'Talent management', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
                { name: 'Insight', icon: PieChart, color: 'text-amber-500', bg: 'bg-amber-50' },
                { name: 'Timesheet', icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                { name: 'Document template', icon: FileText, color: 'text-slate-500', bg: 'bg-slate-50' },
                { name: 'Recruitment', icon: Briefcase, color: 'text-rose-500', bg: 'bg-rose-50' },
                { name: 'Talentics', icon: UserPlus, color: 'text-teal-500', bg: 'bg-teal-50' },
                { name: 'Marketplace', icon: LayoutGrid, color: 'text-orange-500', bg: 'bg-orange-50' },
              ].map((app, i) => (
                <div key={i} className="flex flex-col items-center cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-105 ${app.bg}`}>
                    <app.icon className={`w-5 h-5 ${app.color}`} />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 text-center leading-tight">{app.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 17. Task */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">Task</h3>
              <a href="#" className="text-sm font-semibold text-indigo-600 hover:underline">View All</a>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Review Probation - Sarah Jenkins</h4>
                    <p className="text-xs text-slate-500">Assigned to: HR Manager • Due today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Sidebars) */}
        <div className="space-y-6">
          
          {/* 13. Balance Time Off */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-base font-bold text-slate-800 mb-4">Balance Time Off</h3>
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Annual Leave</h4>
                  <p className="text-xs text-slate-500">Available balance</p>
                </div>
              </div>
              <div className="text-2xl font-black text-indigo-600">
                12 <span className="text-sm font-semibold text-indigo-400">Days</span>
              </div>
            </div>
          </div>

          {/* 12. Quick Links */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-base font-bold text-slate-800 mb-3">Quick Links</h3>
            <div className="space-y-1">
              {[
                { name: 'My Info', icon: User },
                { name: 'Add Employee', icon: UserPlus },
                { name: 'Employee Transfer', icon: Users },
                { name: 'Company Settings', icon: Settings },
                { name: 'Integration', icon: Link }
              ].map((link, i) => (
                <button key={i} onClick={() => { if (link.name === "Add Employee" && onNavigate) onNavigate("hr"); else if (link.name === "Company Settings" && onNavigate) onNavigate("settings"); }} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="text-slate-400 group-hover:text-indigo-600">
                      <link.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{link.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* 15. Announcement */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">Announcement</h3>
              <button className="text-xs font-semibold text-slate-500 flex items-center gap-1 hover:text-slate-800">
                Category <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg mb-3 cursor-pointer hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-orange-200 text-orange-800 text-[10px] font-bold rounded-full uppercase tracking-wider">General</span>
                <span className="text-[11px] text-slate-500">Today</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Company Townhall Q3</h4>
              <p className="text-xs text-slate-600 line-clamp-2">Please join us for the Q3 Company Townhall meeting this Friday at 2 PM in the main lobby.</p>
            </div>
            <a href="#" className="text-sm font-semibold text-indigo-600 hover:underline block text-center mt-2">View all announcements</a>
          </div>

          {/* 16. Contract & Probation */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                Contract & Probation
                <span className="bg-rose-100 text-rose-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">2</span>
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                   <img src="https://i.pravatar.cc/100?img=1" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-800">Budi Santoso</h4>
                  <p className="text-[11px] text-rose-600 font-medium">Probation ends in 5 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                   <img src="https://i.pravatar.cc/100?img=5" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-800">Siti Aminah</h4>
                  <p className="text-[11px] text-orange-600 font-medium">Contract ends in 12 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* 18. Who's Off */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">Who's Off</h3>
              <select className="text-[11px] font-semibold text-slate-500 bg-transparent focus:outline-none">
                <option>Today</option>
                <option>Tomorrow</option>
                <option>This Week</option>
              </select>
            </div>
            <div className="space-y-3">
               <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                   <img src="https://i.pravatar.cc/100?img=3" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-800">Agus Pratama</h4>
                  <p className="text-[11px] text-slate-500">Annual Leave</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

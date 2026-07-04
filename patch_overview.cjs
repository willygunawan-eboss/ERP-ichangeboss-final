const fs = require('fs');
let code = fs.readFileSync('src/components/HRView.tsx', 'utf-8');

const overviewTab = `
function OverviewTab() {
  const { data: employees } = useEmployees();
  const { data: attendance } = useAttendance();
  const { data: payroll } = usePayroll();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600"><Users className="w-5 h-5" /></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-500 text-sm font-medium mb-1">Total Employees</h3>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{employees.length > 0 ? employees.length : 1248}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 className="w-5 h-5" /></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-500 text-sm font-medium mb-1">Present Today</h3>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{attendance.length > 0 ? Array.from(new Set(attendance.map(a => a.employeeId))).length : 1180}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600"><Clock className="w-5 h-5" /></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-500 text-sm font-medium mb-1">Leave Requests</h3>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">12</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600"><AlertCircle className="w-5 h-5" /></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-500 text-sm font-medium mb-1">Pending Payrolls</h3>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{payroll.filter(p => p.status !== 'Paid').length || 15}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Recent Hires</h3>
          <div className="space-y-4">
            {employees.slice(-5).reverse().map((emp, i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  {emp.avatar ? (
                    <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">{emp.name.charAt(0)}</div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{emp.name}</p>
                    <p className="text-xs text-slate-500">{emp.role}</p>
                  </div>
                </div>
                <div className="text-xs font-medium text-slate-500">{emp.joinDate}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Company Culture</h3>
          <p className="text-slate-500 text-sm max-w-sm">Build a stronger workforce by reviewing employee performance and setting clear OKRs in the next cycle.</p>
          <button className="mt-4 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">Start Review Cycle</button>
        </div>
      </div>
    </div>
  );
}
`;

code = code.replace("function EmployeeDirectoryTab()", overviewTab + "\nfunction EmployeeDirectoryTab()");

code = code.replace(
  "{activeTab === 'directory' && <EmployeeDirectoryTab />}",
  "{activeTab === 'overview' && <OverviewTab />}\n        {activeTab === 'directory' && <EmployeeDirectoryTab />}"
);

code = code.replace(
  "(activeTab !== 'directory' && activeTab !== 'attendance' && activeTab !== 'payroll')",
  "(activeTab !== 'overview' && activeTab !== 'directory' && activeTab !== 'attendance' && activeTab !== 'payroll')"
);

// By default set active tab to overview
code = code.replace(
  "const [activeTab, setActiveTab] = useState<HRTab>('attendance');",
  "const [activeTab, setActiveTab] = useState<HRTab>('overview');"
);

fs.writeFileSync('src/components/HRView.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('src/components/HRView.tsx', 'utf-8');

const directoryTabCode = `
function EmployeeDirectoryTab() {
  const { data: employees } = useEmployees();
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-4">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg"><Users className="w-5 h-5" /></div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Employees</p>
          <p className="text-2xl font-bold text-slate-900 leading-none mt-1">{employees.length}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-slate-900 text-base">Employee Directory</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Role & Dept</th>
                <th className="px-6 py-3">Join Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {employees.length === 0 ? (
                 <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No employees found. Add one.</td></tr>
              ) : employees.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="font-semibold text-slate-900">{record.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{record.email} &bull; {record.id}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="font-medium text-slate-900">{record.role}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{record.department}</div>
                  </td>
                  <td className="px-6 py-3 text-slate-600">{record.joinDate}</td>
                  <td className="px-6 py-3">
                    <span className={cn(
                      "px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md",
                      record.status === 'Active' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    )}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`;

// Insert the component at the end of the file
code += "\n\n" + directoryTabCode;

// Update the tab rendering
code = code.replace(
  "{activeTab === 'attendance' && <AttendanceTab />}",
  "{activeTab === 'directory' && <EmployeeDirectoryTab />}\n        {activeTab === 'attendance' && <AttendanceTab />}"
);

// Allow removing the fallback message for directory tab
code = code.replace(
  "(activeTab !== 'attendance' && activeTab !== 'payroll')",
  "(activeTab !== 'directory' && activeTab !== 'attendance' && activeTab !== 'payroll')"
);

code = code.replace(
  "alert('Employee added successfully!');",
  "alert('Employee added successfully!'); window.dispatchEvent(new Event('refetch-employees'));"
);

fs.writeFileSync('src/components/HRView.tsx', code);

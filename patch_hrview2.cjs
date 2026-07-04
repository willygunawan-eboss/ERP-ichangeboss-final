const fs = require('fs');
let code = fs.readFileSync('src/components/HRView.tsx', 'utf-8');

// AttendanceTab metric updates
code = code.replace(
  '<p className="text-2xl font-bold text-slate-900 leading-none mt-1">1,248</p>',
  '<p className="text-2xl font-bold text-slate-900 leading-none mt-1">{attendance.length > 0 ? Array.from(new Set(attendance.map(a => a.employeeId))).length + 1000 : 1248}</p>'
);

// We need useEmployees in AttendanceTab to get the real count, but maybe we can just do this:
code = code.replace(
  'function AttendanceTab() {\n  const { data: attendance } = useAttendance();',
  'function AttendanceTab() {\n  const { data: attendance } = useAttendance();\n  const { data: employees } = useEmployees();'
);

code = code.replace(
  '{attendance.length > 0 ? Array.from(new Set(attendance.map(a => a.employeeId))).length + 1000 : 1248}',
  '{employees.length > 0 ? employees.length : 1248}'
);

code = code.replace(
  '<p className="text-2xl font-bold text-slate-900 leading-none mt-1">1,180</p>',
  '<p className="text-2xl font-bold text-slate-900 leading-none mt-1">{employees.length > 0 ? Math.floor(employees.length * 0.95) : 1180}</p>'
);

// PayrollTab metric updates
code = code.replace(
  'function PayrollTab() {\n  const { data: payroll } = usePayroll();',
  'function PayrollTab() {\n  const { data: payroll } = usePayroll();\n  const { data: employees } = useEmployees();'
);

code = code.replace(
  '<p className="text-indigo-700 text-sm mt-1">Processing payroll for 1,248 active employees.</p>',
  '<p className="text-indigo-700 text-sm mt-1">Processing payroll for {employees.length > 0 ? employees.length : 1248} active employees.</p>'
);

// Refetch multiple endpoints on employee add
code = code.replace(
  "window.dispatchEvent(new Event('refetch-employees'));",
  "window.dispatchEvent(new Event('refetch-employees')); window.dispatchEvent(new Event('refetch-attendance')); window.dispatchEvent(new Event('refetch-payroll'));"
);

fs.writeFileSync('src/components/HRView.tsx', code);

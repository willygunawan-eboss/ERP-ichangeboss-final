const fs = require('fs');
let code = fs.readFileSync('src/components/HRView.tsx', 'utf-8');

code = code.replace(
  `<td className="px-6 py-3">
                    <div className="font-semibold text-slate-900">{record.employeeName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{record.employeeId}</div>
                  </td>`,
  `<td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">{record.employeeName.charAt(0)}</div>
                      <div>
                        <div className="font-semibold text-slate-900">{record.employeeName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{record.employeeId}</div>
                      </div>
                    </div>
                  </td>`
);

fs.writeFileSync('src/components/HRView.tsx', code);

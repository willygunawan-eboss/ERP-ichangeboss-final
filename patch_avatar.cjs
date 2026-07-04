const fs = require('fs');
let code = fs.readFileSync('src/components/HRView.tsx', 'utf-8');

// Update form to include avatar
code = code.replace(
  '<label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>',
  '<label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>'
);

code = code.replace(
  `                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Join Date</label>
                  <input required type="date" name="joinDate" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>`,
  `                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Join Date</label>
                    <input required type="date" name="joinDate" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Photo URL (Optional)</label>
                    <input type="url" name="avatar" placeholder="https://..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                  </div>
                </div>`
);

code = code.replace(
  "avatar: ''",
  "avatar: (formData.get('avatar') as string) || `https://api.dicebear.com/7.x/avataaars/svg?seed=\${formData.get('name')}`"
);

// Update EmployeeDirectoryTab to show avatar
code = code.replace(
  '<th className="px-6 py-3">Employee</th>',
  '<th className="px-6 py-3">Employee</th>'
);

code = code.replace(
  `<div className="font-semibold text-slate-900">{record.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{record.email} &bull; {record.id}</div>`,
  `<div className="flex items-center gap-3">
                      {record.avatar ? (
                         <img src={record.avatar} alt={record.name} className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                      ) : (
                         <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">{record.name.charAt(0)}</div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-900">{record.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{record.email} &bull; {record.id}</div>
                      </div>
                    </div>`
);

fs.writeFileSync('src/components/HRView.tsx', code);

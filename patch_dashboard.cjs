const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');

const importsToAdd = `import { X, Check } from 'lucide-react';
`;
code = code.replace("import { LayoutGrid, User", importsToAdd + "import { LayoutGrid, User");

const statesToAdd = `  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (e: React.FormEvent, endpoint: string, payload: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(\`/api/\${endpoint}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Action successful!');
        setActiveModal(null);
        window.dispatchEvent(new Event('refetch-' + endpoint));
      } else {
        alert('Failed to perform action.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };
`;

code = code.replace("const [stats, setStats] = useState({", statesToAdd + "\n  const [stats, setStats] = useState({");

const onClickLiveAttendance = `onClick={() => setActiveModal('attendance')}`;
const onClickBenefit = `onClick={() => setActiveModal('benefit')}`;
const onClickTimeOff = `onClick={() => setActiveModal('timeoff')}`;
const onClickMore = `onClick={() => setActiveModal('more')}`;

code = code.replace('className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg border border-slate-100 transition-colors group">\n                <Clock', `${onClickLiveAttendance} className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg border border-slate-100 transition-colors group">\n                <Clock`);

code = code.replace('className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg border border-slate-100 transition-colors group">\n                <FileText', `${onClickBenefit} className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg border border-slate-100 transition-colors group">\n                <FileText`);

code = code.replace('className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg border border-slate-100 transition-colors group">\n                <Calendar', `${onClickTimeOff} className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg border border-slate-100 transition-colors group">\n                <Calendar`);

code = code.replace('className="w-full flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-100 transition-colors">\n                  <div', `${onClickMore} className="w-full flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-100 transition-colors">\n                  <div`);

const modalJsx = `
      {/* Modals */}
      {activeModal === 'attendance' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Live Attendance</h2>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-black text-slate-900 mb-1">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div className="text-sm text-slate-500 font-medium">{new Date().toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric'})}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={(e) => handleAction(e, 'attendance', { employeeId: 'EMP-CURRENT', employeeName: 'Current User', date: new Date().toISOString().split('T')[0], checkIn: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), checkOut: '-', status: 'Present', workHours: '-' })}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
                  Check In
                </button>
                <button 
                  onClick={(e) => handleAction(e, 'attendance', { employeeId: 'EMP-CURRENT', employeeName: 'Current User', date: new Date().toISOString().split('T')[0], checkIn: '-', checkOut: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), status: 'Present', workHours: '-' })}
                  disabled={isSubmitting}
                  className="bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
                  Check Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'timeoff' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Request Time Off</h2>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => {
              const formData = new FormData(e.currentTarget);
              handleAction(e, 'attendance', {
                employeeId: 'EMP-CURRENT',
                employeeName: 'Current User',
                date: formData.get('startDate'),
                checkIn: '-',
                checkOut: '-',
                status: 'Leave',
                workHours: '-'
              });
            }} className="p-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Leave Type</label>
                  <select required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                    <option>Annual Leave</option>
                    <option>Sick Leave</option>
                    <option>Unpaid Leave</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Start Date</label>
                    <input required type="date" name="startDate" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">End Date</label>
                    <input required type="date" name="endDate" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Reason</label>
                  <textarea required rows={3} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"></textarea>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setActiveModal(null)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'benefit' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Request Reimbursement</h2>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => {
              const formData = new FormData(e.currentTarget);
              handleAction(e, 'transactions', {
                date: new Date().toISOString().split('T')[0],
                description: 'Reimbursement: ' + formData.get('type'),
                type: 'Expense',
                category: formData.get('type'),
                amount: Number(formData.get('amount')),
                status: 'Pending'
              });
            }} className="p-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Expense Type</label>
                  <select name="type" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                    <option>Medical</option>
                    <option>Travel & Transport</option>
                    <option>Meals</option>
                    <option>Office Supplies</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Rp</span>
                    <input name="amount" type="number" required placeholder="0" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Receipt / Document</label>
                  <input type="file" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setActiveModal(null)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'more' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-900">More Requests</h2>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <button onClick={() => { setActiveModal(null); if (onNavigate) onNavigate('finance'); }} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-center">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-700">Cash Advance</div>
              </button>
              <button onClick={() => { setActiveModal(null); if (onNavigate) onNavigate('inventory'); }} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-center">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-700">Asset Request</div>
              </button>
              <button onClick={() => { setActiveModal(null); if (onNavigate) onNavigate('hr'); }} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-center">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-700">Shift Change</div>
              </button>
              <button onClick={() => { setActiveModal(null); if (onNavigate) onNavigate('helpdesk'); }} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-center">
                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <Link className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-700">IT Support</div>
              </button>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace("    </div>\n  );\n}", modalJsx + "\n    </div>\n  );\n}");

fs.writeFileSync('src/components/DashboardView.tsx', code);

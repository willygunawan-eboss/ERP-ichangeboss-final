const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');

const importsNew = `import { useEmployees, useDashboardStats, useTasks, useAnnouncements, useAttendance } from '../data';`;
code = code.replace("import { useEmployees, useDashboardStats } from '../data';", importsNew);

const hooksNew = `
  const { data: employees } = useEmployees();
  const { data: tasks } = useTasks();
  const { data: announcements } = useAnnouncements();
  const { data: attendance } = useAttendance();
`;
code = code.replace("  const { data: employees } = useEmployees();", hooksNew);

const approveTaskReplace = `
  const approveTask = async (id: string) => {
    try {
      const res = await fetch(\`/api/tasks/\${id}/approve\`, { method: 'POST' });
      if (res.ok) {
        alert("Task " + id + " Approved!");
        window.dispatchEvent(new Event('refetch-tasks'));
      } else {
        alert("Failed to approve task.");
      }
    } catch (e) {
      console.error(e);
    }
  };
`;
code = code.replace(/  const approveTask = \(id: string\) => \{.*?  \};/s, approveTaskReplace);

const contractProbation = `
          {/* 16. Contract & Probation */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                Contract & Probation
                <span className="bg-rose-100 text-rose-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {employees.filter(e => e.status === 'Active').slice(0, 2).length}
                </span>
              </h3>
            </div>
            <div className="space-y-3">
              {employees.filter(e => e.status === 'Active').slice(0, 2).map((emp, i) => (
                <div key={emp.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                     <img src={emp.avatar || \`https://i.pravatar.cc/100?img=\${i+1}\`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-800">{emp.name}</h4>
                    <p className="text-[11px] text-rose-600 font-medium">Probation ends soon</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
`;
code = code.replace(/\{\/\* 16\. Contract & Probation \*\/\}.*?\{\/\* 18\. Who's Off \*\/\}/s, contractProbation + "\n          {/* 18. Who's Off */}");

const whosOff = `
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
              {attendance.filter(a => a.status === 'Leave' || a.status === 'Absent').map((att, i) => {
                const emp = employees.find(e => e.id === att.employeeId) || { avatar: \`https://i.pravatar.cc/100?img=\${i+3}\` };
                return (
                  <div key={att.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                       <img src={emp.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-slate-800">{att.employeeName}</h4>
                      <p className="text-[11px] text-slate-500">{att.status === 'Leave' ? 'Annual Leave' : 'Absent'}</p>
                    </div>
                  </div>
                )
              })}
              {attendance.filter(a => a.status === 'Leave' || a.status === 'Absent').length === 0 && (
                <div className="text-center py-4">
                  <p className="text-xs text-slate-500 font-medium">No one is off today.</p>
                </div>
              )}
            </div>
          </div>
`;
code = code.replace(/\{\/\* 18\. Who's Off \*\/\}.*?<\/div>\n      <\/div>\n    <\/div>/s, whosOff + "\n        </div>\n      </div>\n    </div>");

const tasksRender = `
          {/* 17. Task */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">Task</h3>
              <a href="#" className="text-sm font-semibold text-indigo-600 hover:underline">View All</a>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'Pending').map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{task.title}</h4>
                      <p className="text-xs text-slate-500">Assigned to: {task.assignedTo} • Due {task.dueDate}</p>
                    </div>
                  </div>
                  <button onClick={() => approveTask(task.id)} className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700 transition-colors">Approve</button>
                </div>
              ))}
              {tasks.filter(t => t.status === 'Pending').length === 0 && (
                <div className="text-center py-4">
                  <p className="text-xs text-slate-500 font-medium">You have no pending tasks. Great job!</p>
                </div>
              )}
            </div>
          </div>
`;
code = code.replace(/\{\/\* 17\. Task \*\/\}.*?\{\/\* Right Column \(Sidebars\) \*\/\}/s, tasksRender + "\n        </div>\n        {/* Right Column (Sidebars) */}");

const announcementsRender = `
          {/* 15. Announcement */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">Announcement</h3>
              <button className="text-xs font-semibold text-slate-500 flex items-center gap-1 hover:text-slate-800">
                Category <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            {announcements.map((ann, i) => (
              <div key={ann.id} className="p-4 bg-orange-50 border border-orange-100 rounded-lg mb-3 cursor-pointer hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-orange-200 text-orange-800 text-[10px] font-bold rounded-full uppercase tracking-wider">{ann.category}</span>
                  <span className="text-[11px] text-slate-500">{ann.date}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">{ann.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{ann.content}</p>
              </div>
            ))}
            <a href="#" className="text-sm font-semibold text-indigo-600 hover:underline block text-center mt-2">View all announcements</a>
          </div>
`;
code = code.replace(/\{\/\* 15\. Announcement \*\/\}.*?\{\/\* 16\. Contract & Probation \*\/\}/s, announcementsRender + "\n          {/* 16. Contract & Probation */}");

fs.writeFileSync('src/components/DashboardView.tsx', code);

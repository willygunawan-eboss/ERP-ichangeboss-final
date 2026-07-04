const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');

const imports = `import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useEmployees } from '../data';
`;
code = code.replace("import { X, Check } from 'lucide-react';", imports + "import { X, Check } from 'lucide-react';");

const chartCode = `
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
            
            <div className="h-64">
              <DashboardChart activeChart={activeChart} />
            </div>
          </div>
`;

code = code.replace(/\{\/\* 11\. Chart \*\/\}.*?\{\/\* 14\. Applications \*\/\}/s, chartCode + "\n          {/* 14. Applications */}");

const useEmployeeImport = `
function DashboardChart({ activeChart }: { activeChart: string }) {
  const { data: employees } = useEmployees();
  
  // Calculate stats based on real data (or fallback)
  let data = [];
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  if (activeChart === 'Employment Status') {
    const active = employees.filter(e => e.status === 'Active').length || 1180;
    const inactive = employees.filter(e => e.status !== 'Active').length || 68;
    data = [
      { name: 'Active', value: active },
      { name: 'Inactive/On Leave', value: inactive }
    ];
  } else if (activeChart === 'Length of Service') {
    data = [
      { name: '< 1 Year', value: 340 },
      { name: '1-3 Years', value: 420 },
      { name: '3-5 Years', value: 250 },
      { name: '5+ Years', value: 238 }
    ];
  } else if (activeChart === 'Job Level') {
    data = [
      { name: 'Junior', value: 500 },
      { name: 'Mid-Level', value: 450 },
      { name: 'Senior', value: 200 },
      { name: 'Management', value: 98 }
    ];
  } else {
    data = [
      { name: 'Male', value: 650 },
      { name: 'Female', value: 598 }
    ];
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => new Intl.NumberFormat().format(value as number)} />
        <Legend verticalAlign="bottom" height={36} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
`;

code = code.replace("export function DashboardView", useEmployeeImport + "\nexport function DashboardView");

// Also add a functional task handler
const handleTaskApprove = `
  const approveTask = (id: string) => {
    alert("Task " + id + " Approved!");
    // Dispatch an event or update state if we had a real task table
  };
`;
code = code.replace("  const [stats, setStats] = useState({", handleTaskApprove + "\n  const [stats, setStats] = useState({");

const taskCode = `
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
                <button onClick={() => approveTask('T-01')} className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700 transition-colors">Approve</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Approve Expenses - Q3 Sales</h4>
                    <p className="text-xs text-slate-500">Assigned to: Finance Dept • Due tomorrow</p>
                  </div>
                </div>
                <button onClick={() => approveTask('T-02')} className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700 transition-colors">Approve</button>
              </div>
            </div>
          </div>
`;

code = code.replace(/\{\/\* 17\. Task \*\/\}.*?<\/div>\n          <\/div>/s, taskCode);

// Add interaction to Applications Grid
const appsReplace = `onClick={() => { if(onNavigate) onNavigate(app.nav || 'hr'); }}`;
code = code.replace('className="flex flex-col items-center cursor-pointer group">', `${appsReplace} className="flex flex-col items-center cursor-pointer group">`);
// Need to add nav to applications array
const appsArrayOld = `[
                { name: 'Forms', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
                { name: 'Performance Review', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { name: 'Talent management', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
                { name: 'Insight', icon: PieChart, color: 'text-amber-500', bg: 'bg-amber-50' },
                { name: 'Timesheet', icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                { name: 'Document template', icon: FileText, color: 'text-slate-500', bg: 'bg-slate-50' },
                { name: 'Recruitment', icon: Briefcase, color: 'text-rose-500', bg: 'bg-rose-50' },
                { name: 'Talentics', icon: UserPlus, color: 'text-teal-500', bg: 'bg-teal-50' },
                { name: 'Marketplace', icon: LayoutGrid, color: 'text-orange-500', bg: 'bg-orange-50' },
              ]`;
const appsArrayNew = `[
                { name: 'Forms', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', nav: 'settings' },
                { name: 'Performance Review', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-50', nav: 'hr' },
                { name: 'Talent management', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50', nav: 'hr' },
                { name: 'Insight', icon: PieChart, color: 'text-amber-500', bg: 'bg-amber-50', nav: 'bi' },
                { name: 'Timesheet', icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-50', nav: 'hr' },
                { name: 'Document template', icon: FileText, color: 'text-slate-500', bg: 'bg-slate-50', nav: 'dms' },
                { name: 'Recruitment', icon: Briefcase, color: 'text-rose-500', bg: 'bg-rose-50', nav: 'hr' },
                { name: 'Talentics', icon: UserPlus, color: 'text-teal-500', bg: 'bg-teal-50', nav: 'hr' },
                { name: 'Marketplace', icon: LayoutGrid, color: 'text-orange-500', bg: 'bg-orange-50', nav: 'purchase' },
              ]`;
code = code.replace(appsArrayOld, appsArrayNew);

fs.writeFileSync('src/components/DashboardView.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');

// Remove hooks from DashboardChart
code = code.replace(
  `  const { data: employees } = useEmployees();
  const { data: tasks } = useTasks();
  const { data: announcements } = useAnnouncements();
  const { data: attendance } = useAttendance();`,
  `  const { data: employees } = useEmployees();`
);

// Add hooks to DashboardView
code = code.replace(
  "export function DashboardView({ onNavigate }: { onNavigate?: (id: any) => void }) {\n  const [activeChart, setActiveChart] = useState('Employment Status');",
  `export function DashboardView({ onNavigate }: { onNavigate?: (id: any) => void }) {
  const { data: employees } = useEmployees();
  const { data: tasks } = useTasks();
  const { data: announcements } = useAnnouncements();
  const { data: attendance } = useAttendance();
  const [activeChart, setActiveChart] = useState('Employment Status');`
);

fs.writeFileSync('src/components/DashboardView.tsx', code);

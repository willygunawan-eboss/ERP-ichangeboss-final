const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');

code = code.replace(
  "import { useEmployees } from '../data';",
  "import { useEmployees, useDashboardStats } from '../data';"
);

code = code.replace(
  `  const [stats, setStats] = useState({
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
  }, []);`,
  `  const { stats } = useDashboardStats();`
);

fs.writeFileSync('src/components/DashboardView.tsx', code);

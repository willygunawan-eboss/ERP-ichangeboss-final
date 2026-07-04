const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf-8');

code = code.replace(
  "export function useProjects() { return useApiData<Project>('projects'); }",
  "export function useProjects() { return useApiData<Project>('projects'); }\n\nexport function useDashboardStats() {\n  const [stats, setStats] = useState({ activeEmployees: 0, totalDepartments: 0, openTickets: 0, monthlyRevenue: 0 });\n  const fetcher = useCallback(() => {\n    fetch('/api/dashboard/stats').then(res => res.json()).then(json => { if (json.success) setStats(json.data); }).catch(e => console.error(e));\n  }, []);\n  useEffect(() => { fetcher(); }, [fetcher]);\n  useEffect(() => {\n    const handleRefetch = () => fetcher();\n    window.addEventListener('refetch-dashboard-stats', handleRefetch);\n    return () => window.removeEventListener('refetch-dashboard-stats', handleRefetch);\n  }, [fetcher]);\n  return { stats, refetch: fetcher };\n}"
);

fs.writeFileSync('src/data.ts', code);

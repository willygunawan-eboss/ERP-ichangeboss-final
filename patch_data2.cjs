const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf-8');

// I need to re-order the hooks.
// Let's replace the whole useApiData function
code = code.replace(/export function useApiData[\s\S]*?return \{ data, refetch: fetcher \};\n\}/, 
`export function useApiData<T>(endpoint: string, fallback: T[] = []): { data: T[], refetch: () => void } {
  const [data, setData] = useState<T[]>(fallback);
  const fetcher = useCallback(() => {
    fetch(\`/api/\${endpoint}\`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      })
      .catch(err => console.error('API Error:', err));
  }, [endpoint]);

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  useEffect(() => {
    const handleRefetch = () => fetcher();
    window.addEventListener('refetch-' + endpoint, handleRefetch);
    return () => window.removeEventListener('refetch-' + endpoint, handleRefetch);
  }, [fetcher, endpoint]);

  return { data, refetch: fetcher };
}`);

fs.writeFileSync('src/data.ts', code);

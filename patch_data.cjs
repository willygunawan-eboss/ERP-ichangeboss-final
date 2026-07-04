const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf-8');

code = code.replace(
  "const [data, setData] = useState<T[]>(fallback);",
  `const [data, setData] = useState<T[]>(fallback);
  useEffect(() => {
    const handleRefetch = () => fetcher();
    window.addEventListener('refetch-' + endpoint, handleRefetch);
    return () => window.removeEventListener('refetch-' + endpoint, handleRefetch);
  }, [fetcher, endpoint]);`
);

fs.writeFileSync('src/data.ts', code);

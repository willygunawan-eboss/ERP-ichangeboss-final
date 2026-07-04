const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  'const isAIStudio = !!process.env.K_SERVICE;\n  const PORT = isAIStudio ? 3000 : (process.env.PORT || 3010);',
  'const PORT = process.env.PORT || 3010;'
);

fs.writeFileSync('server.ts', code);

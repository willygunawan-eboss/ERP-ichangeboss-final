const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
pkg.scripts.build = "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs && npx drizzle-kit push";
pkg.scripts.start = "npx drizzle-kit push && node dist/server.cjs";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

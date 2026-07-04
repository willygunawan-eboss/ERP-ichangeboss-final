const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  "await db.insert(schema.employees).values(mockEmployees.map(e => ({...e, avatar: e.avatar || ''})));",
  "await db.insert(schema.employees).values(mockEmployees.map(e => ({...e, avatar: (e as any).avatar || ''})));"
);

code = code.replace(
  "app.listen(PORT, \"0.0.0.0\", () => {",
  "app.listen(Number(PORT), \"0.0.0.0\", () => {"
);

fs.writeFileSync('server.ts', code);

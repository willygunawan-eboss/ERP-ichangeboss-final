const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const additionalSeed = `
    const tasksCount = await db.select().from(schema.tasks);
    if (tasksCount.length === 0) {
      await db.insert(schema.tasks).values([
        { id: 'T-01', title: 'Review Probation - Sarah Jenkins', assignedTo: 'HR Manager', dueDate: new Date().toISOString().split('T')[0], status: 'Pending', type: 'HR' },
        { id: 'T-02', title: 'Approve Expenses - Q3 Sales', assignedTo: 'Finance Dept', dueDate: new Date().toISOString().split('T')[0], status: 'Pending', type: 'Finance' }
      ]);
      await db.insert(schema.announcements).values([
        { id: 'A-01', title: 'Company Townhall Q3', content: 'Please join us for the Q3 Company Townhall meeting this Friday at 2 PM in the main lobby.', category: 'General', date: new Date().toISOString().split('T')[0] }
      ]);
    }
`;

code = code.replace(
  'await db.insert(schema.projects).values(mockProjects);\n  }',
  'await db.insert(schema.projects).values(mockProjects);\n  }\n' + additionalSeed
);

fs.writeFileSync('server.ts', code);

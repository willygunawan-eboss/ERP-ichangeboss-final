const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf-8');

const additionalSchema = `
export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  assignedTo: text('assigned_to').notNull(),
  dueDate: text('due_date').notNull(),
  status: text('status').notNull(), // Pending, Approved, Completed
  type: text('type').notNull(),
});

export const announcements = sqliteTable('announcements', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  date: text('date').notNull(),
});
`;

code = code + additionalSchema;
fs.writeFileSync('src/db/schema.ts', code);

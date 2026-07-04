const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf-8');

const typeTasks = `
export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  status: 'Pending' | 'Approved' | 'Completed';
  type: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
}
`;
fs.appendFileSync('src/types.ts', typeTasks);

code = code.replace(
  "export function useDashboardStats() {",
  `import { Task, Announcement } from './types';
export function useTasks() { return useApiData<Task>('tasks'); }
export function useAnnouncements() { return useApiData<Announcement>('announcements'); }
export function useDashboardStats() {`
);

fs.writeFileSync('src/data.ts', code);

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull(), // 'admin', 'employee', 'manager'
  department: text('department'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const dashboardStats = sqliteTable('dashboard_stats', {
  id: text('id').primaryKey(), // single row, id='main'
  activeEmployees: integer('active_employees').notNull().default(0),
  totalDepartments: integer('total_departments').notNull().default(0),
  openTickets: integer('open_tickets').notNull().default(0),
  monthlyRevenue: real('monthly_revenue').notNull().default(0),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const employees = sqliteTable('employees', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  department: text('department').notNull(),
  status: text('status').notNull(), // Active, On Leave, Terminated
  joinDate: text('join_date').notNull(),
  email: text('email').notNull(),
  avatar: text('avatar'),
});

export const attendance = sqliteTable('attendance', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  employeeName: text('employee_name').notNull(),
  date: text('date').notNull(),
  checkIn: text('check_in').notNull(),
  checkOut: text('check_out').notNull(),
  status: text('status').notNull(), // Present, Late, Absent, Half Day
  workHours: text('work_hours').notNull(),
});

export const payroll = sqliteTable('payroll', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  employeeName: text('employee_name').notNull(),
  period: text('period').notNull(),
  basicSalary: real('basic_salary').notNull(),
  allowances: real('allowances').notNull(),
  deductions: real('deductions').notNull(),
  netPay: real('net_pay').notNull(),
  status: text('status').notNull(), // Paid, Processing, Pending
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  type: text('type').notNull(), // Income, Expense
  amount: real('amount').notNull(),
  status: text('status').notNull(), // Completed, Pending
});

export const salesOrders = sqliteTable('sales_orders', {
  id: text('id').primaryKey(),
  customer: text('customer').notNull(),
  date: text('date').notNull(),
  amount: real('amount').notNull(),
  status: text('status').notNull(), // Completed, Pending, Cancelled
});

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  sku: text('sku').notNull(),
  category: text('category').notNull(),
  price: real('price').notNull(),
  stock: integer('stock').notNull(),
  status: text('status').notNull(), // In Stock, Low Stock, Out of Stock
});

export const productionOrders = sqliteTable('production_orders', {
  id: text('id').primaryKey(),
  product: text('product').notNull(),
  quantity: integer('quantity').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  status: text('status').notNull(), // Planned, In Progress, Completed
  progress: integer('progress').notNull(),
});

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  client: text('client').notNull(),
  dueDate: text('due_date').notNull(),
  budget: real('budget').notNull(),
  status: text('status').notNull(), // Active, Completed, Delayed
  progress: integer('progress').notNull(),
});

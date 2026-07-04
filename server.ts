import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import { db } from "./src/db/index";
import * as schema from "./src/db/schema";
import { eq } from "drizzle-orm";
import { mockEmployees, mockAttendance, mockPayroll, mockTransactions, mockSalesOrders, mockProducts, mockProductionOrders, mockProjects } from "./src/seedData";

async function seedDatabase() {
  const existingStats = await db.select().from(schema.dashboardStats).where(eq(schema.dashboardStats.id, 'main'));
  if (existingStats.length === 0) {
    await db.insert(schema.dashboardStats).values({
      id: 'main', activeEmployees: 1248, totalDepartments: 8, openTickets: 12, monthlyRevenue: 154000
    });
  }

  const employeesCount = await db.select().from(schema.employees);
  if (employeesCount.length === 0) {
    await db.insert(schema.employees).values(mockEmployees.map(e => ({...e, avatar: (e as any).avatar || ''})));
    await db.insert(schema.attendance).values(mockAttendance);
    await db.insert(schema.payroll).values(mockPayroll);
    await db.insert(schema.transactions).values(mockTransactions);
    await db.insert(schema.salesOrders).values(mockSalesOrders);
    await db.insert(schema.products).values(mockProducts);
    await db.insert(schema.productionOrders).values(mockProductionOrders);
    await db.insert(schema.projects).values(mockProjects);
  }

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

}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  await seedDatabase();

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "ICHANGEBOSS API is running", timestamp: new Date().toISOString() });
  });

  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const statsResult = await db.select().from(schema.dashboardStats).where(eq(schema.dashboardStats.id, 'main'));
      res.json({ success: true, data: statsResult[0] });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  const createGetRoute = (path: string, table: any) => {
    app.get(path, async (req, res) => {
      try {
        const result = await db.select().from(table);
        res.json({ success: true, data: result });
      } catch (e) {
        res.status(500).json({ success: false, error: String(e) });
      }
    });
  };

  const createPostRoute = (path: string, table: any) => {
    app.post(path, async (req, res) => {
      try {
        await db.insert(table).values({ id: req.body.id || 'ID-' + Date.now(), ...req.body });
        res.json({ success: true });
      } catch (e) {
        res.status(500).json({ success: false, error: String(e) });
      }
    });
  };

  // Generic Get Routes
  createGetRoute("/api/employees", schema.employees);
  createGetRoute("/api/attendance", schema.attendance);
  createGetRoute("/api/payroll", schema.payroll);
  createGetRoute("/api/transactions", schema.transactions);
  createGetRoute("/api/sales-orders", schema.salesOrders);
  createGetRoute("/api/products", schema.products);
  createGetRoute("/api/production-orders", schema.productionOrders);
  createGetRoute("/api/projects", schema.projects);

  // Custom Employee POST Route
  app.post("/api/employees", async (req, res) => {
    try {
      const employeeId = req.body.id || 'EMP-' + Date.now();
      const employeeName = req.body.name || 'Unknown Employee';
      const joinDate = req.body.joinDate || new Date().toISOString().split('T')[0];
      
      // Insert employee
      await db.insert(schema.employees).values({ id: employeeId, ...req.body, avatar: req.body.avatar || '' });
      
      // Auto-insert attendance for today
      await db.insert(schema.attendance).values({
        id: 'ATT-' + Date.now(),
        employeeId: employeeId,
        employeeName: employeeName,
        date: joinDate,
        checkIn: '08:00',
        checkOut: '17:00',
        status: 'Present',
        workHours: '9h 0m'
      });
      
      // Auto-insert payroll
      await db.insert(schema.payroll).values({
        id: 'PAY-' + Date.now(),
        employeeId: employeeId,
        employeeName: employeeName,
        period: 'June 2026',
        basicSalary: 8000000,
        allowances: 1500000,
        deductions: 200000,
        netPay: 9300000,
        status: 'Processing'
      });
      
      // Update dashboard stats
      const stats = await db.select().from(schema.dashboardStats).where(eq(schema.dashboardStats.id, 'main'));
      if (stats.length > 0) {
        await db.update(schema.dashboardStats)
          .set({ activeEmployees: stats[0].activeEmployees + 1 })
          .where(eq(schema.dashboardStats.id, 'main'));
      }

      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  // Generic Post Routes (except employees which is custom)
  createPostRoute("/api/attendance", schema.attendance);
  createPostRoute("/api/payroll", schema.payroll);
  createPostRoute("/api/transactions", schema.transactions);
  
  // Custom Sales Order POST Route
  app.post("/api/sales-orders", async (req, res) => {
    try {
      await db.insert(schema.salesOrders).values({ id: req.body.id || 'SO-' + Date.now(), ...req.body });
      
      // Update dashboard stats revenue
      const stats = await db.select().from(schema.dashboardStats).where(eq(schema.dashboardStats.id, 'main'));
      if (stats.length > 0 && req.body.amount) {
        await db.update(schema.dashboardStats)
          .set({ monthlyRevenue: stats[0].monthlyRevenue + Number(req.body.amount) })
          .where(eq(schema.dashboardStats.id, 'main'));
      }
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  createPostRoute("/api/products", schema.products);
  createPostRoute("/api/production-orders", schema.productionOrders);
  createGetRoute("/api/tasks", schema.tasks);
  createPostRoute("/api/tasks", schema.tasks);
  createGetRoute("/api/announcements", schema.announcements);
  createPostRoute("/api/announcements", schema.announcements);
  
  app.post("/api/tasks/:id/approve", async (req, res) => {
    try {
      await db.update(schema.tasks).set({ status: 'Approved' }).where(eq(schema.tasks.id, req.params.id));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });
  
  // Custom Project POST Route
  app.post("/api/projects", async (req, res) => {
    try {
      await db.insert(schema.projects).values({ id: req.body.id || 'PRJ-' + Date.now(), ...req.body });
      // Update dashboard open tickets/projects
      const stats = await db.select().from(schema.dashboardStats).where(eq(schema.dashboardStats.id, 'main'));
      if (stats.length > 0) {
        await db.update(schema.dashboardStats)
          .set({ openTickets: stats[0].openTickets + 1 })
          .where(eq(schema.dashboardStats.id, 'main'));
      }
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
  require('fs').writeFileSync('crash.log', String(err.stack || err));
  process.exit(1);
});

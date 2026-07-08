import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
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

    const usersCount = await db.select().from(schema.users);
    if (usersCount.length === 0) {
      const passwordHash = await bcrypt.hash('1234erP', 10);
      await db.insert(schema.users).values({
        id: 'U-01',
        username: 'admin',
        passwordHash,
        name: 'Administrator',
        email: 'admin@ichangeboss.com',
        role: 'admin',
        department: 'Management'
      });
    }
}

async function startServer() {
  const app = express();
  // Di AI Studio, kita HARUS menggunakan port 3000 (DEFAULT_APP_PORT). 
  // Di server Ubuntu pengguna, akan menggunakan process.env.PORT (3010) sesuai ecosystem.config.cjs.
  const PORT = process.env.DEFAULT_APP_PORT ? 3000 : (process.env.PORT || 3010);

  app.use(cors());
  app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'fallback-refresh-secret';

app.use(cookieParser());

const authMiddleware = async (req, res, next) => {
  if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/health'].includes(req.path)) return next();
  if (!req.path.startsWith('/api/')) return next();

  const { token, refreshToken } = req.cookies;
  
  if (!token && !refreshToken) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (e) {
      // Token invalid or expired, fall through to refresh
    }
  }
  
  if (refreshToken) {
    try {
      const decodedRefresh = jwt.verify(refreshToken, REFRESH_SECRET);
      const result = await db.select().from(schema.users).where(eq(schema.users.id, decodedRefresh.id));
      if (result.length > 0 && result[0].refreshToken === refreshToken) {
        const user = result[0];
        const newToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
        res.cookie('token', newToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 15 * 60 * 1000 });
        req.user = { id: user.id, username: user.username, role: user.role };
        return next();
      }
    } catch (e) {
      // Refresh token invalid
    }
  }
  
  res.status(401).json({ success: false, message: 'Token invalid' });
};
app.use('/api', authMiddleware);


app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await db.select().from(schema.users).where(eq(schema.users.username, username));
    if (result.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const user = result[0];
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
    
    await db.update(schema.users).set({ refreshToken }).where(eq(schema.users.id, user.id));
    
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    res.json({ success: true, user: { id: user.id, username: user.username, name: user.name, role: user.role } });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
});

app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'No refresh token' });
    
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as any;
    const result = await db.select().from(schema.users).where(eq(schema.users.id, decoded.id));
    if (result.length === 0 || result[0].refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
    
    const user = result[0];
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 15 * 60 * 1000 });
    res.json({ success: true });
  } catch (e) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as any;
      await db.update(schema.users).set({ refreshToken: null }).where(eq(schema.users.id, decoded.id));
    }
  } catch(e) {}
  
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  if (req.user) return res.json({ success: true, user: req.user });
  res.status(401).json({ success: false, message: 'Not authenticated' });
});





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

const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

// Fix createPostRoute
const brokenCreatePost = `      const createPostRoute = (path: string, table: any) => {
    app.post(path, async (req, res) => {
      try {
        await db.insert(table).values({ id: req.body.id || 'ID-' + Date.now(), ...req.body });
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
  };`;

const fixedCreatePost = `      const createPostRoute = (path: string, table: any) => {
    app.post(path, async (req, res) => {
      try {
        await db.insert(table).values({ id: req.body.id || 'ID-' + Date.now(), ...req.body });
        res.json({ success: true });
      } catch (e) {
        res.status(500).json({ success: false, error: String(e) });
      }
    });
  };`;

code = code.replace(brokenCreatePost, fixedCreatePost);

// Update app.post("/api/employees") to increment dashboard stats
const oldEmployeePost = `      // Auto-insert payroll
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
      
      res.json({ success: true });`;

const newEmployeePost = `      // Auto-insert payroll
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

      res.json({ success: true });`;

code = code.replace(oldEmployeePost, newEmployeePost);

fs.writeFileSync('server.ts', code);

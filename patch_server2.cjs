const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const customEmployeePost = `  app.post("/api/employees", async (req, res) => {
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
      
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });`;

code = code.replace('  createPostRoute("/api/employees", schema.employees);', customEmployeePost);

fs.writeFileSync('server.ts', code);

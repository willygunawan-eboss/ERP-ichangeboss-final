const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const updateStats = `      // Update dashboard stats
      const stats = await db.select().from(schema.dashboardStats).where(eq(schema.dashboardStats.id, 'main'));
      if (stats.length > 0) {
        await db.update(schema.dashboardStats)
          .set({ activeEmployees: stats[0].activeEmployees + 1 })
          .where(eq(schema.dashboardStats.id, 'main'));
      }
      
      res.json({ success: true });`;

code = code.replace('      res.json({ success: true });', updateStats);

fs.writeFileSync('server.ts', code);

const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  'createPostRoute("/api/production-orders", schema.productionOrders);',
  `createPostRoute("/api/production-orders", schema.productionOrders);
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
  });`
);

fs.writeFileSync('server.ts', code);

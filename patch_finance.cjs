const fs = require('fs');
let code = fs.readFileSync('src/components/FinanceView.tsx', 'utf-8');

if (!code.includes('isAddModalOpen')) {
  // Add useState import
  code = code.replace("import React from 'react';", "import React, { useState } from 'react';\nimport { X } from 'lucide-react';");
  
  // Add state to component
  code = code.replace("const { data: transactions } = useTransactions();", "const { data: transactions } = useTransactions();\n  const [isAddModalOpen, setIsAddModalOpen] = useState(false);");
  
  // Update button onClick
  code = code.replace(
    '<button className="bg-indigo-600 hover:bg-indigo-700 text-white',
    '<button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white'
  );
  
  // Add modal code at the end before closing div
  const modalCode = `
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Record Expense</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form 
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const newTx = {
                    date: formData.get('date') || new Date().toISOString().split('T')[0],
                    description: formData.get('description'),
                    category: formData.get('category'),
                    amount: parseFloat(formData.get('amount')),
                    status: 'Completed'
                  };
                  try {
                    const res = await fetch('/api/transactions', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newTx)
                    });
                    if (res.ok) {
                      setIsAddModalOpen(false);
                      alert('Expense recorded successfully!');
                      window.dispatchEvent(new Event('refetch-transactions'));
                    } else {
                      alert('Error recording expense');
                    }
                  } catch (err) {
                    alert('Network error');
                  }
                }}
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Description</label>
                  <input required type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" name="description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Amount (IDR)</label>
                    <input required type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" name="amount" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Category</label>
                    <input required type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" name="category" defaultValue="Operational Expense" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</label>
                  <input required type="date" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" name="date" />
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)} 
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Save Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}`;
  
  code = code.replace("    </div>\n  );\n}", modalCode + "\n    </div>\n  );\n}");
  fs.writeFileSync('src/components/FinanceView.tsx', code);
}

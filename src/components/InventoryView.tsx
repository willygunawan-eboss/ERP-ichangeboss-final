import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Search, Filter, Download, ArrowUpRight, ArrowDownRight, Package, Box, AlertTriangle, Plus } from 'lucide-react';
import { useProducts } from '../data';
import { cn } from '../lib/utils';

export function InventoryView() {
  const { data: products } = useProducts();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto w-full">
      <div className="p-8 pb-0">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory & Stock</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage products, stock levels, and warehouse operations.</p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-indigo-600/20 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Package className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-emerald-50 text-emerald-700">
                <ArrowUpRight className="w-3 h-3" />
                +5.4%
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Total Products</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">1,248</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Box className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-emerald-50 text-emerald-700">
                <ArrowUpRight className="w-3 h-3" />
                +2.1%
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Inventory Value</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">Rp 8.5B</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-rose-50 text-rose-700">
                <ArrowDownRight className="w-3 h-3" />
                -1.2%
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Low Stock Alerts</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-base font-bold text-slate-900">Product Inventory</h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search products or SKU..." 
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors w-full sm:w-auto">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-3">Product Name</th>
                  <th className="px-6 py-3">SKU</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 text-right">Unit Price</th>
                  <th className="px-6 py-3 text-right">Stock Level</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100 text-sm">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  products.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                      <td className="px-6 py-4 text-slate-600">{p.sku}</td>
                      <td className="px-6 py-4 text-slate-600">{p.category}</td>
                      <td className="px-6 py-4 text-right text-slate-900">{formatCurrency(p.price)}</td>
                      <td className="px-6 py-4 text-right text-slate-900 font-medium">{p.stock}</td>
                      <td className="px-6 py-4">
                        <span className={"px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase " + (p.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' : p.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700')}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Add New Product</h2>
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
                  const newProduct = {
                    name: (formData.get('name') as string),
                    sku: (formData.get('sku') as string),
                    category: (formData.get('category') as string),
                    price: parseFloat((formData.get('price') as string)),
                    stock: parseInt((formData.get('stock') as string)),
                    status: 'In Stock'
                  };
                  try {
                    const res = await fetch('/api/products', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newProduct)
                    });
                    if (res.ok) {
                      setIsAddModalOpen(false);
                      alert('Product added successfully!');
                      window.dispatchEvent(new Event('refetch-products'));
                    } else {
                      alert('Error adding product');
                    }
                  } catch (err) {
                    alert('Network error');
                  }
                }}
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Product Name</label>
                  <input required type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" name="name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">SKU</label>
                    <input required type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" name="sku" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Category</label>
                    <input required type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" name="category" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Unit Price (IDR)</label>
                    <input required type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" name="price" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Initial Stock</label>
                    <input required type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" name="stock" />
                  </div>
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
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

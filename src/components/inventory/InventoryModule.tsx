'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Product, ProductCategory } from '@/types';
import {
  Boxes,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Plus,
  ShoppingCart,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  X,
  Warehouse,
  IndianRupee,
  Shield,
  Zap,
  Battery,
  Cable,
  Grid,
} from 'lucide-react';

export const InventoryModule: React.FC = () => {
  const { products, adjustProductStock, setActiveTab, addToast } = useApp();

  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [adjustModalProduct, setAdjustModalProduct] = useState<Product | null>(null);
  const [adjustmentDelta, setAdjustmentDelta] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('Cycle Count Physical Audit');

  // Calculate stock count for each category
  const getCategoryStats = (cat: ProductCategory) => {
    const catProducts = products.filter((p) => p.category === cat);
    const totalUnits = catProducts.reduce((sum, p) => sum + p.inStock, 0);
    const lowStockCount = catProducts.filter((p) => p.status === 'Low Stock' || p.status === 'Out of Stock').length;
    return { totalUnits, lowStockCount, count: catProducts.length };
  };

  const panelsStats = getCategoryStats('Panels');
  const invertersStats = getCategoryStats('Inverters');
  const batteriesStats = getCategoryStats('Batteries');
  const rackingStats = getCategoryStats('Racking');
  const cablingStats = getCategoryStats('Cabling');

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'ALL' || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.warehouseLocation.aisle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalProduct || adjustmentDelta === 0) return;
    adjustProductStock(adjustModalProduct.id, adjustmentDelta, adjustmentReason);
    setAdjustModalProduct(null);
    setAdjustmentDelta(0);
  };

  const handleAddToCart = (product: Product) => {
    addToast({
      title: 'Added to Dispatch Cart',
      message: `${product.brand} - ${product.name.split(' ')[0]} (1 unit staged for quote).`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Dashboard Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-amber-500" />
            <span>Solar Equipment Inventory & Warehouse Bins</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time stock quantities, commodity price trends, and aisle pallet locations at Bhiwandi Depot.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('purchase')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Inbound Restock (PO)</span>
          </button>
        </div>
      </div>

      {/* 5 Category KPI Cards (Panels, Inverters, Batteries, Racking, Cabling) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 1. Panels */}
        <div
          onClick={() => setActiveCategory('Panels')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeCategory === 'Panels'
              ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>☀️</span> Panels
            </span>
            {panelsStats.lowStockCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 font-semibold">
                {panelsStats.lowStockCount} Low
              </span>
            )}
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {panelsStats.totalUnits} <span className="text-xs font-normal text-slate-400">units</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="w-3 h-3 text-emerald-500" />
              <span>Waaree -3.8% drop</span>
            </div>
          </div>
        </div>

        {/* 2. Inverters */}
        <div
          onClick={() => setActiveCategory('Inverters')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeCategory === 'Inverters'
              ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-blue-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>⚡</span> Inverters
            </span>
            {invertersStats.lowStockCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 font-semibold">
                {invertersStats.lowStockCount} Low
              </span>
            )}
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {invertersStats.totalUnits} <span className="text-xs font-normal text-slate-400">units</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="w-3 h-3 text-emerald-500" />
              <span>Sungrow -2.4% drop</span>
            </div>
          </div>
        </div>

        {/* 3. Batteries */}
        <div
          onClick={() => setActiveCategory('Batteries')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeCategory === 'Batteries'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>🔋</span> Batteries
            </span>
            {batteriesStats.lowStockCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 font-semibold">
                {batteriesStats.lowStockCount} Low
              </span>
            )}
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {batteriesStats.totalUnits} <span className="text-xs font-normal text-slate-400">units</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="w-3 h-3 text-emerald-500" />
              <span>LFP Cell -5.6% drop</span>
            </div>
          </div>
        </div>

        {/* 4. Racking */}
        <div
          onClick={() => setActiveCategory('Racking')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeCategory === 'Racking'
              ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-purple-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>🏗️</span> Racking
            </span>
            {rackingStats.lowStockCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 font-semibold">
                {rackingStats.lowStockCount} Low
              </span>
            )}
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {rackingStats.totalUnits} <span className="text-xs font-normal text-slate-400">kits</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-rose-500 dark:text-rose-400">
              <TrendingUp className="w-3 h-3 text-rose-500" />
              <span>Alum Rail +4.8% rise</span>
            </div>
          </div>
        </div>

        {/* 5. Cabling */}
        <div
          onClick={() => setActiveCategory('Cabling')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeCategory === 'Cabling'
              ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-rose-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>🔌</span> Cabling
            </span>
            {cablingStats.lowStockCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 font-semibold">
                {cablingStats.lowStockCount} Low
              </span>
            )}
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {cablingStats.totalUnits} <span className="text-xs font-normal text-slate-400">drums/pk</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-rose-500 dark:text-rose-400">
              <TrendingUp className="w-3 h-3 text-rose-500" />
              <span>Copper +6.4% rise</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          {(['ALL', 'Panels', 'Inverters', 'Batteries', 'Racking', 'Cabling'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeCategory === cat
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Equipment' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search brand, SKU, wattage, bin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Detailed Product Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Product & Brand</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Key Specs</th>
                <th className="px-4 py-3">Stock Units</th>
                <th className="px-4 py-3">Ordered (Mo.)</th>
                <th className="px-4 py-3">Wholesale Price (₹)</th>
                <th className="px-4 py-3">Market Trend</th>
                <th className="px-4 py-3">Warehouse Bin</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    No products found in this category.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const statusBg =
                    product.status === 'In Stock'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200'
                      : product.status === 'Low Stock'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200';

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Product Thumbnail, Name & Brand */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                              <span className="font-medium text-amber-600 dark:text-amber-400">{product.brand}</span>
                              <span>•</span>
                              <span className="font-mono text-[10px]">{product.sku}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {product.category}
                        </span>
                      </td>

                      {/* Key Specs */}
                      <td className="px-4 py-3.5 text-[11px] leading-relaxed">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {product.specs.wattageOrCapacity || product.specs.efficiency}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {product.specs.voltage || product.specs.warranty}
                        </div>
                      </td>

                      {/* Stock Units & Badge */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {product.inStock} <span className="text-[10px] text-slate-400 font-normal">in bay</span>
                        </div>
                        <span
                          className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBg}`}
                        >
                          {product.status}
                        </span>
                      </td>

                      {/* Ordered This Month */}
                      <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                        {product.orderedThisMonth} units
                      </td>

                      {/* Wholesale Price */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          ₹{product.sellingPrice.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Cost: ₹{product.unitCost.toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Market Trend */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {product.marketPriceChangePercent < 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <TrendingDown className="w-3 h-3" />
                            {product.marketPriceChangePercent}% drop
                          </span>
                        ) : product.marketPriceChangePercent > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                            <TrendingUp className="w-3 h-3" />
                            +{product.marketPriceChangePercent}% rise
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Stable</span>
                        )}
                      </td>

                      {/* Warehouse Bin Location */}
                      <td className="px-4 py-3.5 text-[11px]">
                        <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                          {product.warehouseLocation.zone} • {product.warehouseLocation.aisle}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {product.warehouseLocation.palletId}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all"
                            title="Add to wholesale order or dispatch staging"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>

                          <button
                            onClick={() => {
                              setAdjustModalProduct(product);
                              setAdjustmentDelta(0);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                            title="Stock count adjustment"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {adjustModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Physical Stock Adjustment
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {adjustModalProduct.brand} — {adjustModalProduct.name}
                </p>
              </div>
              <button
                onClick={() => setAdjustModalProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Logged Stock:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {adjustModalProduct.inStock} units
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-500">Warehouse Location:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {adjustModalProduct.warehouseLocation.zone} ({adjustModalProduct.warehouseLocation.palletId})
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Stock Delta Adjustment (+ or -)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentDelta((d) => d - 1)}
                    className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                  >
                    -1
                  </button>
                  <input
                    type="number"
                    value={adjustmentDelta}
                    onChange={(e) => setAdjustmentDelta(parseInt(e.target.value) || 0)}
                    className="flex-1 py-1.5 text-center font-bold text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustmentDelta((d) => d + 1)}
                    className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                  >
                    +1
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  New resulting stock: <strong>{Math.max(0, adjustModalProduct.inStock + adjustmentDelta)}</strong> units
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Audit / Adjustment Reason
                </label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  <option value="Cycle Count Physical Audit">Cycle Count Physical Audit</option>
                  <option value="Damaged in Forklift Handling (Quarantined)">Damaged in Forklift Handling (Quarantined)</option>
                  <option value="Supplier Sample Write-Off">Supplier Sample Write-Off</option>
                  <option value="Unrecorded Pallet Discovered">Unrecorded Pallet Discovered</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustmentDelta === 0}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white shadow-sm"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


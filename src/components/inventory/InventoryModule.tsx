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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-3xl bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)]">
        <div>
          <h2 className="text-base font-black text-[#1C1613] dark:text-[#F7F4EF] flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-[#A87208] dark:text-[#FCD34D]" />
            <span>Solar Equipment Inventory & Warehouse Bins</span>
          </h2>
          <p className="text-xs text-[#7D756D] dark:text-[#A89F95] mt-0.5">
            Real-time stock quantities, commodity price trends, and aisle pallet locations at Bhiwandi Depot.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('purchase')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#FCD34D] hover:bg-[#fbbf24] text-[#1C1613] shadow-md shadow-[#FCD34D]/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Inbound Restock (PO)</span>
          </button>
        </div>
      </div>

      {/* 5 Category KPI Cards (Clay Themed with #FCD34D Accents) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 1. Panels */}
        <div
          onClick={() => setActiveCategory('Panels')}
          className={`cursor-pointer p-4 rounded-3xl transition-all ${
            activeCategory === 'Panels'
              ? 'bg-[#FEF9ED] dark:bg-[#281F17] ring-2 ring-[#FCD34D] shadow-sm'
              : 'bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_8px_-2px_rgba(40,30,20,0.03)] hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1C1613] dark:text-[#F7F4EF] flex items-center gap-1.5">
              <span>☀️</span> Panels
            </span>
            {panelsStats.lowStockCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FEF6E6] text-[#A6680C] dark:bg-[#2D2115] dark:text-[#FCD34D] font-bold">
                {panelsStats.lowStockCount} Low
              </span>
            )}
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-[#1C1613] dark:text-[#FBF9F5]">
              {panelsStats.totalUnits} <span className="text-xs font-normal text-[#8F867C]">units</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-[#168051] dark:text-[#78E0A9]">
              <TrendingDown className="w-3 h-3 text-[#168051]" />
              <span>Waaree -3.8% drop</span>
            </div>
          </div>
        </div>

        {/* 2. Inverters */}
        <div
          onClick={() => setActiveCategory('Inverters')}
          className={`cursor-pointer p-4 rounded-3xl transition-all ${
            activeCategory === 'Inverters'
              ? 'bg-[#FEF9ED] dark:bg-[#281F17] ring-2 ring-[#FCD34D] shadow-sm'
              : 'bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_8px_-2px_rgba(40,30,20,0.03)] hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1C1613] dark:text-[#F7F4EF] flex items-center gap-1.5">
              <span>⚡</span> Inverters
            </span>
            {invertersStats.lowStockCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FEF6E6] text-[#A6680C] dark:bg-[#2D2115] dark:text-[#FCD34D] font-bold">
                {invertersStats.lowStockCount} Low
              </span>
            )}
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-[#1C1613] dark:text-[#FBF9F5]">
              {invertersStats.totalUnits} <span className="text-xs font-normal text-[#8F867C]">units</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-[#168051] dark:text-[#78E0A9]">
              <TrendingDown className="w-3 h-3 text-[#168051]" />
              <span>Sungrow -2.4% drop</span>
            </div>
          </div>
        </div>

        {/* 3. Batteries */}
        <div
          onClick={() => setActiveCategory('Batteries')}
          className={`cursor-pointer p-4 rounded-3xl transition-all ${
            activeCategory === 'Batteries'
              ? 'bg-[#FEF9ED] dark:bg-[#281F17] ring-2 ring-[#FCD34D] shadow-sm'
              : 'bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_8px_-2px_rgba(40,30,20,0.03)] hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1C1613] dark:text-[#F7F4EF] flex items-center gap-1.5">
              <span>🔋</span> Batteries
            </span>
            {batteriesStats.lowStockCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FEF6E6] text-[#A6680C] dark:bg-[#2D2115] dark:text-[#FCD34D] font-bold">
                {batteriesStats.lowStockCount} Low
              </span>
            )}
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-[#1C1613] dark:text-[#FBF9F5]">
              {batteriesStats.totalUnits} <span className="text-xs font-normal text-[#8F867C]">units</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-[#168051] dark:text-[#78E0A9]">
              <TrendingDown className="w-3 h-3 text-[#168051]" />
              <span>LFP Cell -5.6% drop</span>
            </div>
          </div>
        </div>

        {/* 4. Racking */}
        <div
          onClick={() => setActiveCategory('Racking')}
          className={`cursor-pointer p-4 rounded-3xl transition-all ${
            activeCategory === 'Racking'
              ? 'bg-[#FEF9ED] dark:bg-[#281F17] ring-2 ring-[#FCD34D] shadow-sm'
              : 'bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_8px_-2px_rgba(40,30,20,0.03)] hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1C1613] dark:text-[#F7F4EF] flex items-center gap-1.5">
              <span>🏗️</span> Racking
            </span>
            {rackingStats.lowStockCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FEF6E6] text-[#A6680C] dark:bg-[#2D2115] dark:text-[#FCD34D] font-bold">
                {rackingStats.lowStockCount} Low
              </span>
            )}
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-[#1C1613] dark:text-[#FBF9F5]">
              {rackingStats.totalUnits} <span className="text-xs font-normal text-[#8F867C]">kits</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-[#DC2626]">
              <TrendingUp className="w-3 h-3 text-[#DC2626]" />
              <span>Alum Rail +4.8% rise</span>
            </div>
          </div>
        </div>

        {/* 5. Cabling */}
        <div
          onClick={() => setActiveCategory('Cabling')}
          className={`cursor-pointer p-4 rounded-3xl transition-all ${
            activeCategory === 'Cabling'
              ? 'bg-[#FEF9ED] dark:bg-[#281F17] ring-2 ring-[#FCD34D] shadow-sm'
              : 'bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_8px_-2px_rgba(40,30,20,0.03)] hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1C1613] dark:text-[#F7F4EF] flex items-center gap-1.5">
              <span>🔌</span> Cabling
            </span>
            {cablingStats.lowStockCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FEF6E6] text-[#A6680C] dark:bg-[#2D2115] dark:text-[#FCD34D] font-bold">
                {cablingStats.lowStockCount} Low
              </span>
            )}
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-[#1C1613] dark:text-[#FBF9F5]">
              {cablingStats.totalUnits} <span className="text-xs font-normal text-[#8F867C]">drums/pk</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-[#DC2626]">
              <TrendingUp className="w-3 h-3 text-[#DC2626]" />
              <span>Copper +6.4% rise</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#F4F0E8] dark:bg-[#241E19] border border-[#EBE7DF] dark:border-[#352B24]">
          {(['ALL', 'Panels', 'Inverters', 'Batteries', 'Racking', 'Cabling'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeCategory === cat
                  ? 'bg-[#1C1613] dark:bg-[#FCD34D] text-white dark:text-[#1C1613] shadow-sm'
                  : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613] dark:hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'All Equipment' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8F867C]" />
          <input
            type="text"
            placeholder="Search brand, SKU, wattage, bin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#1A1512] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
          />
        </div>
      </div>

      {/* Detailed Product Table */}
      <div className="rounded-3xl dark:border dark:border-[#2D2520] bg-white dark:bg-[#1A1512] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] dark:bg-[#201A16] text-[#7D756D] dark:text-[#A89F95] uppercase font-bold text-[10px] tracking-wider border-b border-[#EBE7DF]/60 dark:border-[#2D2520]">
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
            <tbody className="divide-y divide-[#F2EEE6] dark:divide-[#28211B] text-[#1C1613] dark:text-[#F7F4EF]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#FEF6E6] dark:bg-[#2D2115] text-[#A87208] dark:text-[#FCD34D] flex items-center justify-center">
                        <Warehouse className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-sm text-[#1C1613] dark:text-white">
                        No equipment matched your filters
                      </p>
                      <p className="text-xs text-[#8F867C] dark:text-[#A89F95]">
                        Try searching a different SKU, brand, or resetting the category filter.
                      </p>
                      {(searchQuery || activeCategory !== 'ALL') && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setActiveCategory('ALL');
                          }}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FCD34D] text-[#1C1613] hover:bg-[#fbbf24] transition-all"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const statusBg =
                    product.status === 'In Stock'
                      ? 'bg-[#E8F8F0] text-[#168051] border-[#C6EED8] dark:bg-[#1A2D22] dark:text-[#78E0A9]'
                      : product.status === 'Low Stock'
                      ? 'bg-[#FEF6E6] text-[#A6680C] border-[#FDE3B2] dark:bg-[#2D2115] dark:text-[#FCD34D]'
                      : 'bg-[#FDF2F2] text-[#DC2626] border-[#FECACA] dark:bg-[#2F1C1C] dark:text-[#F87171]';

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-[#FBF9F5]/70 dark:hover:bg-[#201A16]/50 transition-colors"
                    >
                      {/* Product Thumbnail, Name & Brand */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-11 h-11 rounded-xl object-cover border border-[#E8E3DA] dark:border-[#352B24] shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[#1C1613] dark:text-white leading-tight">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#7D756D] dark:text-[#A89F95]">
                              <span className="font-semibold text-[#A87208] dark:text-[#FCD34D]">{product.brand}</span>
                              <span>•</span>
                              <span className="font-mono text-[10px]">{product.sku}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4F0E8] text-[#5C5247] dark:bg-[#2A221C] dark:text-[#D4CCC0]">
                          {product.category}
                        </span>
                      </td>

                      {/* Key Specs */}
                      <td className="px-4 py-3.5 text-[11px] leading-relaxed">
                        <div className="font-bold text-[#1C1613] dark:text-[#FAF7F2]">
                          {product.specs.wattageOrCapacity || product.specs.efficiency}
                        </div>
                        <div className="text-[10px] text-[#8F867C] dark:text-[#80766B]">
                          {product.specs.voltage || product.specs.warranty}
                        </div>
                      </td>

                      {/* Stock Units & Badge */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-black text-[#1C1613] dark:text-white text-sm">
                          {product.inStock} <span className="text-[10px] text-[#8F867C] font-normal">in bay</span>
                        </div>
                        <span
                          className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBg}`}
                        >
                          ● {product.status}
                        </span>
                      </td>

                      {/* Ordered This Month */}
                      <td className="px-4 py-3.5 font-bold text-[#1C1613] dark:text-[#FAF7F2]">
                        {product.orderedThisMonth} units
                      </td>

                      {/* Wholesale Price */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-black text-[#1C1613] dark:text-white text-sm">
                          ₹{product.sellingPrice.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-[#8F867C] dark:text-[#80766B]">
                          Cost: ₹{product.unitCost.toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Market Trend */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {product.marketPriceChangePercent < 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#168051] dark:text-[#78E0A9]">
                            <TrendingDown className="w-3 h-3" />
                            {product.marketPriceChangePercent}% drop
                          </span>
                        ) : product.marketPriceChangePercent > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626]">
                            <TrendingUp className="w-3 h-3" />
                            +{product.marketPriceChangePercent}% rise
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#8F867C]">Stable</span>
                        )}
                      </td>

                      {/* Warehouse Bin Location */}
                      <td className="px-4 py-3.5 text-[11px]">
                        <span className="font-mono font-semibold text-[#1C1613] dark:text-[#FAF7F2]">
                          {product.warehouseLocation.zone} • {product.warehouseLocation.aisle}
                        </span>
                        <div className="text-[10px] text-[#8F867C] dark:text-[#80766B]">
                          {product.warehouseLocation.palletId}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FCD34D] hover:bg-[#fbbf24] text-[#1C1613] shadow-xs transition-all"
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
                            className="p-1.5 rounded-xl text-[#7D756D] dark:text-[#A89F95] hover:bg-[#F4F0E8] dark:hover:bg-[#28201A] border border-[#E8E3DA] dark:border-[#352B24] transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1A1512] rounded-3xl dark:border dark:border-[#2D2520] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#1C1613] dark:text-white">
                  Physical Stock Adjustment
                </h3>
                <p className="text-xs text-[#7D756D] dark:text-[#A89F95]">
                  {adjustModalProduct.brand} — {adjustModalProduct.name}
                </p>
              </div>
              <button
                onClick={() => setAdjustModalProduct(null)}
                className="p-1 rounded-lg text-[#8F867C] hover:text-[#1C1613]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-3">
              <div className="p-3 rounded-2xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#EBE7DF] dark:border-[#2D2520] text-xs">
                <div className="flex justify-between">
                  <span className="text-[#7D756D]">Current Logged Stock:</span>
                  <span className="font-black text-[#1C1613] dark:text-white">
                    {adjustModalProduct.inStock} units
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[#7D756D]">Warehouse Location:</span>
                  <span className="font-mono font-semibold text-[#1C1613] dark:text-white">
                    {adjustModalProduct.warehouseLocation.zone} ({adjustModalProduct.warehouseLocation.palletId})
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
                  Stock Delta Adjustment (+ or -)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentDelta((d) => d - 1)}
                    className="w-10 h-10 rounded-xl bg-[#F4F0E8] dark:bg-[#28201A] font-black text-[#1C1613] dark:text-white hover:bg-[#EAE4D8]"
                  >
                    -1
                  </button>
                  <input
                    type="number"
                    value={adjustmentDelta}
                    onChange={(e) => setAdjustmentDelta(parseInt(e.target.value) || 0)}
                    className="flex-1 py-2 text-center font-black text-sm rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustmentDelta((d) => d + 1)}
                    className="w-10 h-10 rounded-xl bg-[#F4F0E8] dark:bg-[#28201A] font-black text-[#1C1613] dark:text-white hover:bg-[#EAE4D8]"
                  >
                    +1
                  </button>
                </div>
                <p className="text-[11px] text-[#8F867C] mt-1">
                  New resulting stock: <strong>{Math.max(0, adjustModalProduct.inStock + adjustmentDelta)}</strong> units
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
                  Audit / Adjustment Reason
                </label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2]"
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7D756D] hover:bg-[#F4F0E8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustmentDelta === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FCD34D] hover:bg-[#fbbf24] disabled:opacity-50 text-[#1C1613] shadow-xs"
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

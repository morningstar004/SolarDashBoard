'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  TrendingUp,
  Package,
  Truck,
  AlertTriangle,
  IndianRupee,
  Layers,
  ArrowUpRight,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Plus,
  Eye,
  ChevronDown,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Zap,
  Battery,
  Cable,
  Warehouse,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const DashboardModule: React.FC = () => {
  const {
    products,
    orders,
    setActiveTab,
    setSelectedOrderIdForChecklist,
    setSelectedOrderIdForTracking,
  } = useApp();

  // Chart view selector
  const [selectedChart, setSelectedChart] = useState<'spline' | 'bar' | 'pie'>('spline');

  // Activity stream filters
  const [streamSearch, setStreamSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Total Revenue Calculation (This month mock + actual orders)
  const totalRevenueThisMonth = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 7850000;
  const revenueGrowthPercent = 18.4;

  // Active orders & Pending Dispatches breakdown
  const activeOrders = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const inTransitCount = orders.filter((o) => o.status === 'In Transit').length;
  const pendingDispatchCount = orders.filter(
    (o) => o.status === 'Ready for Inspection' || o.status === 'Processing' || o.status === 'Pre-Dispatch Approved'
  ).length;

  // Inventory valuation
  const totalInventoryValuation = products.reduce((acc, p) => acc + p.inStock * p.sellingPrice, 0);

  // Low stock items by category
  const lowStockPanels = products.filter((p) => p.category === 'Panels' && (p.status === 'Low Stock' || p.status === 'Out of Stock'));
  const lowStockInverters = products.filter((p) => p.category === 'Inverters' && (p.status === 'Low Stock' || p.status === 'Out of Stock'));
  const lowStockBatteries = products.filter((p) => p.category === 'Batteries' && (p.status === 'Low Stock' || p.status === 'Out of Stock'));
  const lowStockRacking = products.filter((p) => p.category === 'Racking' && (p.status === 'Low Stock' || p.status === 'Out of Stock'));
  const lowStockCabling = products.filter((p) => p.category === 'Cabling' && (p.status === 'Low Stock' || p.status === 'Out of Stock'));

  // 1. Spline Data: Current Month vs Last Month Solar Panel Sales (in units)
  const splineSalesData = [
    { period: 'Week 1', currentMonth: 320, lastMonth: 240 },
    { period: 'Week 2', currentMonth: 480, lastMonth: 390 },
    { period: 'Week 3', currentMonth: 610, lastMonth: 450 },
    { period: 'Week 4', currentMonth: 780, lastMonth: 580 },
    { period: 'Week 5 (Est)', currentMonth: 950, lastMonth: 720 },
  ];

  // 2. Bar Chart Data: Current Inventory Items - Cost Price vs Market Price & Units
  const barInventoryData = products.slice(0, 7).map((p) => ({
    name: p.name.split(' ')[0] + ' ' + (p.specs.wattageOrCapacity || p.brand.split(' ')[0]),
    costPrice: p.unitCost,
    marketPrice: p.sellingPrice,
    unitsRemaining: p.inStock,
  }));

  // 3. Pie Chart Data: Order Completion & Delays
  const pieStatusData = [
    { name: 'Delivered On-Time', value: 18, color: '#10B981' },
    { name: 'In-Transit Smooth', value: 8, color: '#3B82F6' },
    { name: 'Dock QC Inspection', value: 5, color: '#FCD34D' },
    { name: 'Transit Delay (Toll/Rain)', value: 2, color: '#EF4444' },
    { name: 'Order Processing', value: 4, color: '#8B5CF6' },
  ];

  // Filtered Activity Stream
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(streamSearch.toLowerCase()) ||
        order.customer.company.toLowerCase().includes(streamSearch.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(streamSearch.toLowerCase()) ||
        order.logistics.partner.toLowerCase().includes(streamSearch.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'ACTIVE'
          ? order.status !== 'Delivered' && order.status !== 'Cancelled'
          : order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, streamSearch, statusFilter]);

  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      {/* Clay Dark Espresso Hero Banner (Inspired by reference banner) */}
      <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-[#231C18] dark:bg-[#1A1411] text-white border border-[#382E27] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#3A3027] text-[#FCD34D] border border-[#524438]">
            <span>✨ HeliosOps Verified Solar Distributor • GST & BIS Compliant</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Operational Command Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#C4BCB3] leading-relaxed">
            Centralized solar equipment distribution across Maharashtra, Gujarat & Rajasthan. Real-time fleet tracking, automated pre-dispatch QC, and inventory valuation.
          </p>
        </div>

        {/* Action Buttons in Hero Banner */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('sales')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#FCD34D] hover:bg-[#fbbf24] text-[#1C1613] shadow-md shadow-[#FCD34D]/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ New Sales Order</span>
          </button>

          <button
            onClick={() => setActiveTab('purchase')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-[#362C25] hover:bg-[#43372E] text-[#F7F4EF] border border-[#4D3F35] transition-all"
          >
            <Layers className="w-4 h-4 text-[#FCD34D]" />
            <span>Raise Supplier PO</span>
          </button>

          <button
            onClick={() => {
              setSelectedOrderIdForChecklist('SO-9102');
              setActiveTab('checklist');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-[#2B231D] hover:bg-[#382E26] text-[#A3E635] border border-[#42362C] transition-all"
          >
            <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
            <span>Pre-Dispatch QC</span>
          </button>
        </div>
      </div>

      {/* 4 Clay Metric KPI Cards (Inspired by the 4 cards in the user image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue (Replaces Total Orders) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D756D] dark:text-[#A89F95]">
              Total Revenue (Gross)
            </span>
            <div className="w-8 h-8 rounded-full bg-[#E8F8F0] dark:bg-[#1A2D22] text-[#168051] dark:text-[#78E0A9] flex items-center justify-center font-bold">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#1C1613] dark:text-[#FBF9F5]">
              {formatINR(totalRevenueThisMonth)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-[#168051] dark:text-[#78E0A9]">
              <span className="flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{revenueGrowthPercent}%
              </span>
              <span className="text-[#8F867C] dark:text-[#80766B] font-medium">vs last month</span>
            </div>
            <p className="text-[11px] text-[#8F867C] dark:text-[#80766B] mt-1">
              Wholesale volume across MH & GJ corridors
            </p>
          </div>
        </div>

        {/* Card 2: Combined Active Orders & Pending Dispatches */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D756D] dark:text-[#A89F95]">
              Active Orders & Fleet
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FEF6E6] dark:bg-[#2D2115] text-[#C27E0C] dark:text-[#FCD34D] flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#1C1613] dark:text-[#FBF9F5]">
                {activeOrders.length + 14}
              </span>
              <span className="text-xs font-medium text-[#7D756D] dark:text-[#A89F95]">orders active</span>
            </div>

            {/* Sub-breakdown in the same card */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#F0EBE1] dark:border-[#28201A]">
              <div className="bg-[#F8F5EE] dark:bg-[#221B17] p-2 rounded-2xl">
                <p className="text-[10px] text-[#8F867C] dark:text-[#A89F95] uppercase font-bold">In-Transit</p>
                <p className="text-sm font-black text-[#2E5AAC] dark:text-[#93B4F5]">{inTransitCount + 7} Fleet</p>
              </div>
              <div className="bg-[#FEF9ED] dark:bg-[#261E17] p-2 rounded-2xl">
                <p className="text-[10px] text-[#8F867C] dark:text-[#A89F95] uppercase font-bold">Dock Staged</p>
                <p className="text-sm font-black text-[#C27E0C] dark:text-[#FCD34D]">{pendingDispatchCount + 6} Ready</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Total Inventory Valuation */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D756D] dark:text-[#A89F95]">
              Total Inventory Valuation
            </span>
            <div className="w-8 h-8 rounded-full bg-[#F4F0E8] dark:bg-[#28201A] text-[#5C5247] dark:text-[#D4CCC0] flex items-center justify-center font-bold">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#1C1613] dark:text-[#FBF9F5]">
              {formatINR(totalInventoryValuation)}
            </div>
            <p className="text-xs text-[#7D756D] dark:text-[#A89F95] mt-1">
              5 categories • 768 physical units in bays
            </p>
            <div className="flex items-center gap-2 mt-3 pt-2 text-[11px] text-[#168051] dark:text-[#78E0A9] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Physical cycle count verified</span>
            </div>
          </div>
        </div>

        {/* Card 4: Active Low-Stock Alerts with Category Sticker Icons */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A6680C] dark:text-[#FCD34D] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#D99814] dark:text-[#FCD34D]" />
              Low-Stock Alerts
            </span>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-[11px] font-bold text-[#A6680C] dark:text-[#FCD34D] hover:underline"
            >
              Restock
            </button>
          </div>

          <div className="mt-2.5">
            <p className="text-[11px] text-[#7D756D] dark:text-[#A89F95] mb-2 font-medium">
              Items below safety threshold:
            </p>

            {/* Sticker Badges for 5 Categories (Clay Yellow #FCD34D Theme) */}
            <div className="flex flex-wrap gap-1.5">
              {/* Panels */}
              <div
                onClick={() => setActiveTab('inventory')}
                className="cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#FEF6E6] hover:bg-[#FDEFC4] dark:bg-[#2D2115] text-[#1C1613] dark:text-[#FCD34D] border border-[#FDE3B2] dark:border-[#4B3722] transition-colors"
                title="Panels Low Stock"
              >
                <span>☀️</span>
                <span>Panels</span>
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#FCD34D] text-[#1C1613] text-[10px]">
                  {lowStockPanels.length}
                </span>
              </div>

              {/* Inverters */}
              <div
                onClick={() => setActiveTab('inventory')}
                className="cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#EEF4FF] hover:bg-[#E0EBFF] dark:bg-[#1E2638] text-[#1C1613] dark:text-[#93B4F5] border border-[#CCDDFE] dark:border-[#304163] transition-colors"
                title="Inverters Low Stock"
              >
                <span>⚡</span>
                <span>Inverters</span>
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#FCD34D] text-[#1C1613] text-[10px]">
                  {lowStockInverters.length}
                </span>
              </div>

              {/* Batteries */}
              <div
                onClick={() => setActiveTab('inventory')}
                className="cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#E8F8F0] hover:bg-[#D4F3E4] dark:bg-[#1A2D22] text-[#1C1613] dark:text-[#78E0A9] border border-[#C6EED8] dark:border-[#2C4837] transition-colors"
                title="Batteries Low Stock"
              >
                <span>🔋</span>
                <span>Batteries</span>
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#FCD34D] text-[#1C1613] text-[10px]">
                  {lowStockBatteries.length}
                </span>
              </div>

              {/* Racking */}
              <div
                onClick={() => setActiveTab('inventory')}
                className="cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#F4F0E8] hover:bg-[#EBE5DA] dark:bg-[#2A221C] text-[#1C1613] dark:text-[#D4CCC0] border border-[#E0D8CA] dark:border-[#3D322A] transition-colors"
                title="Racking Low Stock"
              >
                <span>🏗️</span>
                <span>Racking</span>
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#FCD34D] text-[#1C1613] text-[10px]">
                  {lowStockRacking.length}
                </span>
              </div>

              {/* Cabling */}
              <div
                onClick={() => setActiveTab('inventory')}
                className="cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#FDF2F2] hover:bg-[#FCE5E5] dark:bg-[#2F1C1C] text-[#1C1613] dark:text-[#F87171] border border-[#FECACA] dark:border-[#4B2929] transition-colors"
                title="Cabling Low Stock"
              >
                <span>🔌</span>
                <span>Cabling</span>
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#FCD34D] text-[#1C1613] text-[10px]">
                  {lowStockCabling.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Analytics with Dropdown View (Clay styled) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-[#1C1613] dark:text-[#F7F4EF] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#C28E00] dark:text-[#FCD34D]" />
              <span>Interactive Analytics & Comparative Insights</span>
            </h3>
            <p className="text-xs text-[#7D756D] dark:text-[#A89F95] mt-0.5">
              Select analytical view to compare solar panel sales, inventory margins, or delay metrics.
            </p>
          </div>

          {/* Chart Dropdown Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8F867C] font-semibold">View Chart:</span>
            <select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value as 'spline' | 'bar' | 'pie')}
              className="text-xs font-bold px-3 py-2 rounded-xl bg-[#F8F5EE] dark:bg-[#241E19] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#F7F4EF] focus:outline-none focus:ring-2 focus:ring-[#FCD34D] cursor-pointer"
            >
              <option value="spline">📈 Spline Chart: Solar Panel Sales (Current vs Last Month)</option>
              <option value="bar">📊 Bar Chart: Cost Price vs Market Price & Units</option>
              <option value="pie">🥧 Pie Chart: Order Completion & Delay Breakdown</option>
            </select>
          </div>
        </div>

        {/* 1. Spline Chart View (Using #FCD34D primary line!) */}
        {selectedChart === 'spline' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7D756D] dark:text-[#A89F95]">
              <span className="font-bold text-[#1C1613] dark:text-[#FAF7F2]">
                Solar Panel Wholesale Volume (Units Dispatched Weekly)
              </span>
              <div className="flex items-center gap-4 text-[11px] font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FCD34D]"></span>
                  Current Month (Nov)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8F867C]"></span>
                  Last Month (Oct)
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={splineSalesData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="currentMonthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FCD34D" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#FCD34D" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="lastMonthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8F867C" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8F867C" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EBE7DF" opacity={0.6} />
                  <XAxis dataKey="period" stroke="#8F867C" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8F867C" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#231C18',
                      borderRadius: '16px',
                      color: '#fff',
                      border: '1px solid #382E27',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="currentMonth"
                    name="Current Month"
                    stroke="#FCD34D"
                    strokeWidth={3.5}
                    fillOpacity={1}
                    fill="url(#currentMonthGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="lastMonth"
                    name="Last Month"
                    stroke="#8F867C"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#lastMonthGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 2. Bar Chart View: Cost Price vs Market Price & Units */}
        {selectedChart === 'bar' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7D756D] dark:text-[#A89F95]">
              <span className="font-bold text-[#1C1613] dark:text-[#FAF7F2]">
                Unit Cost Price vs Current Market Selling Price (₹ INR)
              </span>
              <div className="flex items-center gap-4 text-[11px] font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8F867C]"></span>
                  Cost Price (Procured)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FCD34D]"></span>
                  Market Selling Price
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barInventoryData} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EBE7DF" opacity={0.6} />
                  <XAxis
                    dataKey="name"
                    stroke="#8F867C"
                    fontSize={10}
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#8F867C"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#231C18',
                      borderRadius: '16px',
                      color: '#fff',
                      border: '1px solid #382E27',
                      fontSize: '12px',
                    }}
                    formatter={(value: any, name: any) => [`₹${Number(value).toLocaleString('en-IN')}`, name]}
                  />
                  <Bar dataKey="costPrice" name="Cost Price" fill="#8F867C" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="marketPrice" name="Market Selling Price" fill="#FCD34D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 3. Pie Chart View: Order Completion & Delays */}
        {selectedChart === 'pie' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#231C18',
                      borderRadius: '16px',
                      color: '#fff',
                      border: '1px solid #382E27',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7D756D] dark:text-[#A89F95]">
                Fulfillment Health & Delivery Metrics
              </h4>
              <div className="space-y-2">
                {pieStatusData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#EBE7DF] dark:border-[#2D2520] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md" style={{ backgroundColor: item.color }}></span>
                      <span className="font-semibold text-[#1C1613] dark:text-[#F7F4EF]">{item.name}</span>
                    </div>
                    <span className="font-black text-[#1C1613] dark:text-[#FCD34D]">{item.value} orders</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#8F867C] dark:text-[#80766B]">
                Average Bhiwandi to Gujarat transit: 18.2 hours. Fleet delay rate: &lt;5%.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Real-Time Activity Stream Table (Matches the user's reference table aesthetic) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-[#1C1613] dark:text-[#F7F4EF]">
              Recent Ongoing Orders
            </h3>
            <p className="text-xs text-[#7D756D] dark:text-[#A89F95] mt-0.5">
              Live order fulfillment stream across Indian pin codes and solar parks.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8F867C]" />
              <input
                type="text"
                placeholder="Search order ID or buyer..."
                value={streamSearch}
                onChange={(e) => setStreamSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#FCD34D] cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Pipelines</option>
              <option value="Ready for Inspection">Ready for QC</option>
              <option value="In Transit">In Transit</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Table of Orders */}
        <div className="overflow-x-auto rounded-2xl border border-[#EBE7DF] dark:border-[#2D2520]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] dark:bg-[#201A16] text-[#7D756D] dark:text-[#A89F95] uppercase font-bold text-[10px] tracking-wider border-b border-[#EBE7DF] dark:border-[#2D2520]">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Purchased Merchandise</th>
                <th className="px-4 py-3">Logistics Partner</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EEE6] dark:divide-[#28211B] text-[#1C1613] dark:text-[#F7F4EF]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#8F867C]">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  // Beautiful status pill colors matching user's image
                  const statusColors =
                    order.status === 'Delivered'
                      ? 'bg-[#E8F8F0] text-[#168051] border-[#C6EED8] dark:bg-[#1A2D22] dark:text-[#78E0A9] dark:border-[#2C4837]'
                      : order.status === 'In Transit'
                      ? 'bg-[#EEF4FF] text-[#2E5AAC] border-[#CCDDFE] dark:bg-[#1E2638] dark:text-[#93B4F5] dark:border-[#304163]'
                      : order.status === 'Ready for Inspection'
                      ? 'bg-[#FEF6E6] text-[#A6680C] border-[#FDE3B2] dark:bg-[#2D2115] dark:text-[#FCD34D] dark:border-[#4B3722] animate-pulse'
                      : order.status === 'Pre-Dispatch Approved'
                      ? 'bg-[#E8F8F0] text-[#168051] border-[#C6EED8] dark:bg-[#1A2D22] dark:text-[#78E0A9]'
                      : 'bg-[#F4F0E8] text-[#5C5247] border-[#E5DFD4] dark:bg-[#2A221C] dark:text-[#D4CCC0]';

                  const merchandiseSummary = order.items
                    .map((item) => `${item.productName.split(' ')[0]} ${item.category} (x${item.requiredQty})`)
                    .join(', ');

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#FBF9F5]/70 dark:hover:bg-[#201A16]/50 transition-colors"
                    >
                      <td className="px-4 py-3.5 font-black font-mono text-[#1C1613] dark:text-[#FCD34D]">
                        {order.id}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[#1C1613] dark:text-[#F7F4EF]">
                          {order.customer.name}
                        </div>
                        <div className="text-[11px] text-[#7D756D] dark:text-[#A89F95]">
                          {order.customer.company}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs">
                        <p className="truncate text-[#1C1613] dark:text-[#F7F4EF] font-medium" title={merchandiseSummary}>
                          {merchandiseSummary}
                        </p>
                        <span className="text-[10px] text-[#8F867C] dark:text-[#80766B]">
                          {order.items.length} line items
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-[#1C1613] dark:text-[#F7F4EF]">
                          {order.logistics.partner}
                        </div>
                        <div className="font-mono text-[10px] text-[#8F867C] dark:text-[#80766B]">
                          {order.logistics.vehicleNumber}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[#7D756D] dark:text-[#A89F95] whitespace-nowrap font-medium">
                        {order.orderDate}
                      </td>
                      <td className="px-4 py-3.5 font-black text-[#1C1613] dark:text-[#F7F4EF] whitespace-nowrap">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors}`}
                        >
                          ● {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === 'Ready for Inspection' ? (
                            <button
                              onClick={() => {
                                setSelectedOrderIdForChecklist(order.id);
                                setActiveTab('checklist');
                              }}
                              className="px-3 py-1 rounded-xl text-[11px] font-bold bg-[#FCD34D] hover:bg-[#fbbf24] text-[#1C1613] shadow-xs transition-all"
                            >
                              Verify QC
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedOrderIdForTracking(order.id);
                                setActiveTab('tracking');
                              }}
                              className="px-3 py-1 rounded-xl text-[11px] font-semibold bg-[#F4F0E8] hover:bg-[#EBE5DA] dark:bg-[#28201A] dark:hover:bg-[#342A22] text-[#1C1613] dark:text-[#FAF7F2] transition-all"
                            >
                              Track
                            </button>
                          )}
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
    </div>
  );
};

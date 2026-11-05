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
  const totalRevenueThisMonth = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 7850000; // ₹89+ Lakh
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
    { name: 'Dock QC Inspection', value: 5, color: '#F59E0B' },
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
      {/* Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Operational Command Hub</span>
            <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Live Indian Distribution
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor orders, floor dispatches, equipment inventory, and carrier fleet.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('sales')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Sales Order</span>
          </button>

          <button
            onClick={() => setActiveTab('purchase')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>Raise Supplier PO</span>
          </button>

          <button
            onClick={() => {
              setSelectedOrderIdForChecklist('SO-9102');
              setActiveTab('checklist');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Launch Pre-Dispatch QC</span>
          </button>
        </div>
      </div>

      {/* 4 Requested KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue (Replaces Total Orders) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Monthly Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatINR(totalRevenueThisMonth)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{revenueGrowthPercent}%
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-normal">vs last month</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Wholesale volume across Maharashtra & Gujarat
            </p>
          </div>
        </div>

        {/* Card 2: Combined Active Orders & Pending Dispatches (Same Card, Removed Completed) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Orders & Dispatches
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {activeOrders.length + 14}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">orders in pipeline</span>
            </div>

            {/* Sub-breakdown in the same card */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="bg-sky-50/60 dark:bg-sky-950/30 p-2 rounded-xl">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">In-Transit</p>
                <p className="text-sm font-bold text-sky-700 dark:text-sky-300">{inTransitCount + 7} Fleet</p>
              </div>
              <div className="bg-amber-50/60 dark:bg-amber-950/30 p-2 rounded-xl">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Pending Dock</p>
                <p className="text-sm font-bold text-amber-700 dark:text-amber-300">{pendingDispatchCount + 6} Staged</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Total Inventory Valuation */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Inventory Valuation
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatINR(totalInventoryValuation)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Across 5 equipment categories (768 physical units stocked)
            </p>
            <div className="flex items-center gap-2 mt-3 pt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Audited 2 days ago by Sunita Gupta</span>
            </div>
          </div>
        </div>

        {/* Card 4: Active Low-Stock Alerts with Category Sticker Icons */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Low-Stock Alerts
            </span>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-[11px] font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 hover:underline"
            >
              Restock All
            </button>
          </div>

          <div className="mt-2.5">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
              Critical items below safety threshold:
            </p>

            {/* Sticker Badges for 5 Categories */}
            <div className="flex flex-wrap gap-1.5">
              {/* Panels */}
              <div
                onClick={() => setActiveTab('inventory')}
                className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 transition-colors"
                title="Panels Low Stock: Waaree 545W"
              >
                <span>☀️</span>
                <span>Panels</span>
                <span className="ml-0.5 px-1 rounded-full bg-amber-200 dark:bg-amber-800 text-[10px]">
                  {lowStockPanels.length}
                </span>
              </div>

              {/* Inverters */}
              <div
                onClick={() => setActiveTab('inventory')}
                className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 transition-colors"
                title="Inverters Low Stock: Sungrow 50kW"
              >
                <span>⚡</span>
                <span>Inverters</span>
                <span className="ml-0.5 px-1 rounded-full bg-blue-200 dark:bg-blue-800 text-[10px]">
                  {lowStockInverters.length}
                </span>
              </div>

              {/* Batteries */}
              <div
                onClick={() => setActiveTab('inventory')}
                className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 transition-colors"
                title="Batteries Low Stock: Luminous LFP Rack"
              >
                <span>🔋</span>
                <span>Batteries</span>
                <span className="ml-0.5 px-1 rounded-full bg-emerald-200 dark:bg-emerald-800 text-[10px]">
                  {lowStockBatteries.length}
                </span>
              </div>

              {/* Racking */}
              <div
                onClick={() => setActiveTab('inventory')}
                className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 transition-colors"
                title="Racking Low Stock: Rayzon Clamps"
              >
                <span>🏗️</span>
                <span>Racking</span>
                <span className="ml-0.5 px-1 rounded-full bg-purple-200 dark:bg-purple-800 text-[10px]">
                  {lowStockRacking.length}
                </span>
              </div>

              {/* Cabling */}
              <div
                onClick={() => setActiveTab('inventory')}
                className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 transition-colors"
                title="Cabling Low Stock: Polycab 4mm DC Drum"
              >
                <span>🔌</span>
                <span>Cabling</span>
                <span className="ml-0.5 px-1 rounded-full bg-rose-200 dark:bg-rose-800 text-[10px]">
                  {lowStockCabling.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section with Dropdown Selection (3 Charts requested) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" />
              <span>Interactive Analytics & Comparative Insights</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select analytical view to compare solar panel sales, inventory margins, or delay metrics.
            </p>
          </div>

          {/* Chart Dropdown Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">View Chart:</span>
            <select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value as 'spline' | 'bar' | 'pie')}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="spline">📈 Spline Chart: Solar Panel Sales (Current vs Last Month)</option>
              <option value="bar">📊 Bar Chart: Cost Price vs Market Price & Units</option>
              <option value="pie">🥧 Pie Chart: Order Completion & Delay Breakdown</option>
            </select>
          </div>
        </div>

        {/* 1. Spline Chart View */}
        {selectedChart === 'spline' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Solar Panel Wholesale Volume (Units Dispatched Weekly)
              </span>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Current Month (Nov)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  Last Month (Oct)
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={splineSalesData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="currentMonthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="lastMonthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="currentMonth"
                    name="Current Month"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#currentMonthGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="lastMonth"
                    name="Last Month"
                    stroke="#94A3B8"
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
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Unit Cost Price vs Current Market Selling Price (₹ INR)
              </span>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  Cost Price (Procured)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Market Selling Price
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barInventoryData} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                    formatter={(value: any, name: any) => [`₹${Number(value).toLocaleString('en-IN')}`, name]}
                  />
                  <Bar dataKey="costPrice" name="Cost Price" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="marketPrice" name="Market Selling Price" fill="#F59E0B" radius={[4, 4, 0, 0]} />
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
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Fulfillment Health & Delivery Metrics
              </h4>
              <div className="space-y-2">
                {pieStatusData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md" style={{ backgroundColor: item.color }}></span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{item.value} orders</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Average Bhiwandi to Gujarat transit: 18.2 hours. Fleet delay rate: &lt;5%.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Real-Time Activity Stream (Live Orders Table with Search & Filter) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Real-Time Activity Stream: Ongoing Orders</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live floor operations, customer orders, logistics carriers, and status progressions.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, EPC..."
                value={streamSearch}
                onChange={(e) => setStreamSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
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
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Purchased Merchandise</th>
                <th className="px-4 py-3">Logistics Partner</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount (₹)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusColors =
                    order.status === 'Pre-Dispatch Approved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300'
                      : order.status === 'In Transit'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300'
                      : order.status === 'Ready for Inspection'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 animate-pulse'
                      : order.status === 'Delivered'
                      ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300';

                  const merchandiseSummary = order.items
                    .map((item) => `${item.productName.split(' ')[0]} ${item.category} (x${item.requiredQty})`)
                    .join(', ');

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3.5 font-bold font-mono text-slate-900 dark:text-white">
                        {order.id}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {order.customer.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {order.customer.company}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs">
                        <p className="truncate text-slate-700 dark:text-slate-300" title={merchandiseSummary}>
                          {merchandiseSummary}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {order.items.length} line items
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {order.logistics.partner}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {order.logistics.vehicleNumber}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {order.orderDate}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColors}`}
                        >
                          {order.status}
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
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                            >
                              Verify QC
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedOrderIdForTracking(order.id);
                                setActiveTab('tracking');
                              }}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all"
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

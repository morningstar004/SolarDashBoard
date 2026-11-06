'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Order, OrderStatus } from '@/types';
import {
  ShoppingCart,
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronUp,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Calendar,
  Layers,
  FileText,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const SalesOrdersModule: React.FC = () => {
  const {
    orders,
    setActiveTab,
    setSelectedOrderIdForChecklist,
    setSelectedOrderIdForTracking,
    createSalesOrder,
    updateOrderStatus,
  } = useApp();

  // Horizontal top option bar filter
  const [pipelineFilter, setPipelineFilter] = useState<
    'ALL' | 'ONGOING' | 'PENDING_QC' | 'DELIVERED_HISTORY' | 'CANCELLED'
  >('ONGOING');

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('ALL');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('ALL');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>('SO-9102');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Order Form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newAmount, setNewAmount] = useState<number>(850000);
  const [newTransporter, setNewTransporter] = useState<
    'V-Trans India' | 'TCI Express' | 'Safexpress' | 'Delhivery Freight'
  >('V-Trans India');

  // Filter orders according to the horizontal options, search query, date, and order type
  const filteredOrders = orders.filter((order) => {
    let matchesPipeline = true;
    if (pipelineFilter === 'ONGOING') {
      matchesPipeline = order.status === 'Confirmed' || order.status === 'Processing' || order.status === 'In Transit';
    } else if (pipelineFilter === 'PENDING_QC') {
      matchesPipeline = order.status === 'Ready for Inspection' || order.status === 'Pre-Dispatch Approved';
    } else if (pipelineFilter === 'DELIVERED_HISTORY') {
      matchesPipeline = order.status === 'Delivered';
    } else if (pipelineFilter === 'CANCELLED') {
      matchesPipeline = order.status === 'Cancelled';
    }

    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.logistics.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.destinationCity.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (dateFilter === 'TODAY') {
      matchesDate = order.orderDate >= '2026-11-05';
    } else if (dateFilter === 'LAST_7_DAYS') {
      matchesDate = order.orderDate >= '2026-10-30';
    } else if (dateFilter === 'THIS_MONTH') {
      matchesDate = order.orderDate.startsWith('2026-11');
    } else if (dateFilter === 'LAST_MONTH') {
      matchesDate = order.orderDate.startsWith('2026-10');
    }

    let matchesOrderType = true;
    if (orderTypeFilter === 'Tier-1 EPC') {
      matchesOrderType = order.customer.tier === 'Tier-1 EPC';
    } else if (orderTypeFilter === 'Commercial Developer') {
      matchesOrderType = order.customer.tier === 'Commercial Developer';
    } else if (orderTypeFilter === 'Rooftop Installer') {
      matchesOrderType = order.customer.tier === 'Rooftop Installer';
    } else if (orderTypeFilter === 'CRITICAL_PRIORITY') {
      matchesOrderType = order.urgency === 'Critical Project' || order.urgency === 'High Priority';
    } else if (orderTypeFilter === 'HAS_BATTERIES') {
      matchesOrderType = order.items.some((i) => i.category === 'Batteries');
    } else if (orderTypeFilter === 'HAS_INVERTERS') {
      matchesOrderType = order.items.some((i) => i.category === 'Inverters');
    }

    return matchesPipeline && matchesSearch && matchesDate && matchesOrderType;
  });

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName || !newCustomerName) return;

    createSalesOrder({
      customer: {
        name: newCustomerName,
        company: newCompanyName,
        tier: 'Tier-1 EPC',
        contact: `${newCustomerName.toLowerCase().replace(/\s+/g, '.')}@${newCompanyName.toLowerCase().replace(/\s+/g, '')}.in`,
        phone: '+91 98201 ' + Math.floor(10000 + Math.random() * 90000),
        destinationCity: newCity || 'Pune Industrial Solar Zone',
        state: 'Maharashtra',
        fullAddress: `Plot ${Math.floor(10 + Math.random() * 80)}, GIDC Industrial Corridor, ${newCity || 'Pune'}`,
        gstin: '27AABC' + Math.floor(1000 + Math.random() * 8999) + 'Q1Z2',
      },
      totalAmount: newAmount,
      logistics: {
        partner: newTransporter,
        vehicleNumber: 'MH 04 ' + ['AB', 'CD', 'EF'][Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 8999),
        driverName: 'Suresh Gaikwad',
        driverPhone: '+91 97110 ' + Math.floor(10000 + Math.random() * 90000),
        trailerType: '24ft Heavy Open Bed',
        lrNumber: 'LR-VT-' + Math.floor(10000 + Math.random() * 90000),
        estimatedDeliveryDate: '2026-11-08 16:00 IST',
      },
    });

    setShowCreateModal(false);
    setNewCustomerName('');
    setNewCompanyName('');
    setNewCity('');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Title & Requested Horizontal Option Bar on Top Right */}
      <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-4 bg-white dark:bg-[#1A1512] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] p-5 dark:border-[#2D2520] rounded-3xl">
        <div>
          <h2 className="flex items-center gap-2 font-black text-[#1C1613] dark:text-[#F7F4EF] text-base">
            <ShoppingCart className="w-5 h-5 text-[#A87208] dark:text-[#FCD34D]" />
            <span>Sales & Order Lifecycle Management</span>
          </h2>
          <p className="mt-0.5 text-[#7D756D] dark:text-[#A89F95] text-xs">
            Monitor incoming customer demand, milestone fulfillment, and equipment allocation.
          </p>
        </div>

        {/* Horizontal Option Bar on the Top Right (Pill style matching reference image) */}
        <div className="flex flex-wrap items-center self-start lg:self-auto gap-1.5 bg-[#F4F0E8] dark:bg-[#241E19] p-1 border border-[#EBE7DF] dark:border-[#352B24] rounded-2xl">
          <button
            onClick={() => setPipelineFilter('ONGOING')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${pipelineFilter === 'ONGOING'
                ? 'bg-[#1C1613] dark:bg-[#FCD34D] text-white dark:text-[#1C1613] shadow-xs'
                : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613] dark:hover:text-white'
              }`}
          >
            Ongoing ({orders.filter((o) => o.status === 'Confirmed' || o.status === 'Processing' || o.status === 'In Transit').length})
          </button>

          <button
            onClick={() => setPipelineFilter('PENDING_QC')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${pipelineFilter === 'PENDING_QC'
                ? 'bg-[#1C1613] dark:bg-[#FCD34D] text-white dark:text-[#1C1613] shadow-xs'
                : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613] dark:hover:text-white'
              }`}
          >
            Pending QC ({orders.filter((o) => o.status === 'Ready for Inspection' || o.status === 'Pre-Dispatch Approved').length})
          </button>

          <button
            onClick={() => setPipelineFilter('DELIVERED_HISTORY')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${pipelineFilter === 'DELIVERED_HISTORY'
                ? 'bg-[#1C1613] dark:bg-[#FCD34D] text-white dark:text-[#1C1613] shadow-xs'
                : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613] dark:hover:text-white'
              }`}
          >
            Delivered ({orders.filter((o) => o.status === 'Delivered').length})
          </button>

          <button
            onClick={() => setPipelineFilter('CANCELLED')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${pipelineFilter === 'CANCELLED'
                ? 'bg-[#1C1613] dark:bg-[#FCD34D] text-white dark:text-[#1C1613] shadow-xs'
                : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613] dark:hover:text-white'
              }`}
          >
            Cancelled ({orders.filter((o) => o.status === 'Cancelled').length})
          </button>

          <button
            onClick={() => setPipelineFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${pipelineFilter === 'ALL'
                ? 'bg-[#1C1613] dark:bg-[#FCD34D] text-white dark:text-[#1C1613] shadow-xs'
                : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613] dark:hover:text-white'
              }`}
          >
            All ({orders.length})
          </button>
        </div>
      </div>

      {/* Subheader Search, Date & Type Filters, and Create Order action */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="top-1/2 left-3 absolute w-3.5 h-3.5 text-[#8F867C] -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Order ID, Client, City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-[#1A1512] py-2 pr-3 pl-8 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl focus:outline-none focus:ring-[#FCD34D] focus:ring-2 w-full text-[#1C1613] dark:text-[#FAF7F2] text-xs transition-all placeholder-[#8F867C]"
            />
          </div>

          {/* Date Filter Dropdown */}
          <div className="relative flex items-center w-full sm:w-auto">
            <Calendar className="w-3.5 h-3.5 absolute left-3 pointer-events-none text-[#8F867C]" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              aria-label="Filter by order date"
              className="appearance-none bg-white dark:bg-[#1A1512] py-2 pl-8 pr-7 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl focus:outline-none focus:ring-[#FCD34D] focus:ring-2 text-[#1C1613] dark:text-[#FAF7F2] text-xs font-semibold cursor-pointer w-full sm:w-auto transition-colors hover:border-[#D4CDC1]"
            >
              <option value="ALL">All Dates</option>
              <option value="TODAY">Today (Nov 5-6)</option>
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="THIS_MONTH">This Month (Nov 2026)</option>
              <option value="LAST_MONTH">Last Month (Oct 2026)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 pointer-events-none text-[#8F867C]" />
          </div>

          {/* Type of Order Filter Dropdown */}
          <div className="relative flex items-center w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 absolute left-3 pointer-events-none text-[#8F867C]" />
            <select
              value={orderTypeFilter}
              onChange={(e) => setOrderTypeFilter(e.target.value)}
              aria-label="Filter by order type"
              className="appearance-none bg-white dark:bg-[#1A1512] py-2 pl-8 pr-7 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl focus:outline-none focus:ring-[#FCD34D] focus:ring-2 text-[#1C1613] dark:text-[#FAF7F2] text-xs font-semibold cursor-pointer w-full sm:w-auto transition-colors hover:border-[#D4CDC1]"
            >
              <option value="ALL">All Order Types</option>
              <option value="Tier-1 EPC">Tier-1 EPC (Utility Scale)</option>
              <option value="Commercial Developer">Commercial & Industrial (C&I)</option>
              <option value="Rooftop Installer">Rooftop Solar Installer</option>
              <option value="CRITICAL_PRIORITY">Critical / High Priority</option>
              <option value="HAS_BATTERIES">BESS / Battery Storage</option>
              <option value="HAS_INVERTERS">Inverters Only / Replacement</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 pointer-events-none text-[#8F867C]" />
          </div>

          {/* Quick Clear Button when any filter is active */}
          {(dateFilter !== 'ALL' || orderTypeFilter !== 'ALL' || searchQuery.trim() !== '') && (
            <button
              onClick={() => {
                setDateFilter('ALL');
                setOrderTypeFilter('ALL');
                setSearchQuery('');
              }}
              className="px-2.5 py-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex justify-center items-center gap-2 bg-[#FCD34D] hover:bg-[#fbbf24] shadow-[#FCD34D]/20 shadow-md px-4 py-2.5 rounded-2xl font-bold text-[#1C1613] text-xs transition-all shrink-0"
        >
          <Plus className="stroke-[2.5] w-4 h-4" />
          <span>Create New Sales Order</span>
        </button>
      </div>

      {/* Orders List with Expandable Detailed Timeline & BOS Items */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-[#1A1512] p-8 border border-[#EBE7DF] dark:border-[#2D2520] rounded-3xl text-[#8F867C] text-xs text-center">
            No orders match the current filter selection.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            const statusBadgeColor =
              order.status === 'Delivered'
                ? 'bg-[#E8F8F0] text-[#168051] border-[#C6EED8] dark:bg-[#1A2D22] dark:text-[#78E0A9]'
                : order.status === 'In Transit'
                  ? 'bg-[#EEF4FF] text-[#2E5AAC] border-[#CCDDFE] dark:bg-[#1E2638] dark:text-[#93B4F5]'
                  : order.status === 'Ready for Inspection'
                    ? 'bg-[#FEF6E6] text-[#A6680C] border-[#FDE3B2] dark:bg-[#2D2115] dark:text-[#FCD34D] animate-pulse'
                    : order.status === 'Pre-Dispatch Approved'
                      ? 'bg-[#E8F8F0] text-[#168051] border-[#C6EED8] dark:bg-[#1A2D22] dark:text-[#78E0A9]'
                      : 'bg-[#F4F0E8] text-[#5C5247] border-[#E5DFD4] dark:bg-[#2A221C] dark:text-[#D4CCC0]';

            const otherThanPanels = order.items.filter((i) => i.category !== 'Panels');

            return (
              <div
                key={order.id}
                className={`rounded-3xl border transition-all ${isExpanded
                    ? 'bg-white dark:bg-[#1A1512] border-[#FCD34D] shadow-md'
                    : 'bg-white dark:bg-[#1A1512] border-[#EBE7DF] dark:border-[#2D2520] hover:border-[#DBD5C8]'
                  }`}
              >
                {/* Main Order Row */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="flex md:flex-row flex-col justify-between md:items-center gap-4 p-5 cursor-pointer"
                >
                  {/* Left Column: Order ID & Customer */}
                  <div className="flex items-start gap-3 min-w-[220px]">
                    <div className="flex justify-center items-center bg-[#FEF6E6] dark:bg-[#2D2115] border border-[#FDE3B2] dark:border-[#4B3722] rounded-2xl w-10 h-10 font-mono font-black text-[#C27E0C] dark:text-[#FCD34D] text-xs shrink-0">
                      SO
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-[#1C1613] dark:text-white text-sm">
                          {order.id}
                        </span>
                        <span className="bg-[#F4F0E8] dark:bg-[#28201A] px-2 py-0.5 rounded-full font-bold text-[#5C5247] text-[10px] dark:text-[#D4CCC0]">
                          {order.urgency}
                        </span>
                      </div>
                      <p className="mt-0.5 font-bold text-[#1C1613] dark:text-[#F7F4EF] text-xs">
                        {order.customer.name}
                      </p>
                      <p className="text-[#7D756D] text-[11px] dark:text-[#A89F95]">{order.customer.company}</p>
                    </div>
                  </div>

                  {/* Middle Column 1: Purchased Merchandise summary */}
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-bold text-[#8F867C] text-[10px] uppercase">Purchased Merchandise</p>
                    <p className="mt-0.5 font-semibold text-[#1C1613] dark:text-[#FAF7F2] text-xs line-clamp-1">
                      {order.items.map((i) => `${i.productName.split(' ')[0]} ${i.category} (x${i.requiredQty})`).join(', ')}
                    </p>
                    <p className="mt-0.5 text-[#7D756D] text-[11px] dark:text-[#A89F95]">
                      {order.items.length} line items • Destination: {order.customer.destinationCity}
                    </p>
                  </div>

                  {/* Middle Column 2: Logistics Partner & Vehicle */}
                  <div className="min-w-[150px]">
                    <p className="font-bold text-[#8F867C] text-[10px] uppercase">Logistics Partner</p>
                    <p className="mt-0.5 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      {order.logistics.partner}
                    </p>
                    <p className="font-mono text-[#7D756D] text-[11px] dark:text-[#A89F95]">
                      {order.logistics.vehicleNumber}
                    </p>
                  </div>

                  {/* Amount & Status */}
                  <div className="flex justify-between md:justify-end items-center gap-4 min-w-[190px]">
                    <div>
                      <p className="font-bold text-[#8F867C] text-[10px] uppercase">Total Amount</p>
                      <p className="font-black text-[#1C1613] dark:text-white text-sm">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadgeColor}`}
                      >
                        ● {order.status}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#8F867C]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#8F867C]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section: Extended Timeline + BOS Items */}
                {isExpanded && (
                  <div className="space-y-4 bg-[#FBF9F5]/70 dark:bg-[#16120F] p-5 border-[#EBE7DF] dark:border-[#2D2520] border-t rounded-b-3xl">
                    {/* Action Bar inside Expanded Row */}
                    <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-[#EBE7DF] dark:border-[#2D2520] border-b text-xs">
                      <div className="flex items-center gap-4">
                        <span className="text-[#7D756D]">
                          Assigned Trader:{' '}
                          <strong className="text-[#1C1613] dark:text-white">
                            {order.assignedTrader}
                          </strong>
                        </span>
                        <span className="text-[#7D756D]">
                          QC Inspector:{' '}
                          <strong className="text-[#1C1613] dark:text-white">
                            {order.assignedInspector}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === 'Ready for Inspection' && (
                          <button
                            onClick={() => {
                              setSelectedOrderIdForChecklist(order.id);
                              setActiveTab('checklist');
                            }}
                            className="flex items-center gap-1.5 bg-[#FCD34D] hover:bg-[#fbbf24] shadow-xs px-3.5 py-1.5 rounded-xl font-bold text-[#1C1613] text-xs"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Launch Pre-Dispatch Checklist</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedOrderIdForTracking(order.id);
                            setActiveTab('tracking');
                          }}
                          className="flex items-center gap-1.5 bg-white hover:bg-[#F4F0E8] dark:bg-[#1A1512] px-3 py-1.5 border border-[#EBE7DF] dark:border-[#2D2520] rounded-xl font-semibold text-[#1C1613] dark:text-white text-xs"
                        >
                          <Truck className="w-3.5 h-3.5 text-[#C27E0C] dark:text-[#FCD34D]" />
                          <span>View Live GPS Fleet Tracking</span>
                        </button>
                      </div>
                    </div>

                    <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
                      {/* Left: Extra Products provided other than solar panels */}
                      <div className="space-y-2 bg-white dark:bg-[#1A1512] p-4 border border-[#EBE7DF] dark:border-[#2D2520] rounded-2xl">
                        <h4 className="flex items-center gap-1.5 font-bold text-[#7D756D] dark:text-[#A89F95] text-xs uppercase tracking-wider">
                          <Layers className="w-3.5 h-3.5 text-[#C27E0C] dark:text-[#FCD34D]" />
                          <span>Balance of System (BOS) & Non-Panel Equipment</span>
                        </h4>
                        <p className="text-[#8F867C] text-[11px]">
                          Inverters, battery energy storage, mounting structures & DC cables supplied:
                        </p>

                        <div className="space-y-1.5 pt-1">
                          {otherThanPanels.length === 0 ? (
                            <p className="text-[#8F867C] text-xs italic">Only PV Modules on this order.</p>
                          ) : (
                            otherThanPanels.map((item) => (
                              <div
                                key={item.productId}
                                className="flex justify-between items-center bg-[#F8F5EE] dark:bg-[#221B17] p-2.5 rounded-xl text-xs"
                              >
                                <div>
                                  <span className="font-bold text-[#1C1613] dark:text-[#F7F4EF]">
                                    {item.productName}
                                  </span>
                                  <div className="text-[#7D756D] text-[10px] dark:text-[#A89F95]">
                                    {item.brand} • {item.category}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-black text-[#1C1613] dark:text-white">
                                    {item.requiredQty} units
                                  </span>
                                  <div className="text-[#8F867C] text-[10px]">
                                    ₹{item.unitPrice.toLocaleString('en-IN')}/unit
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Right: Milestone Timeline */}
                      <div className="space-y-2 bg-white dark:bg-[#1A1512] p-4 border border-[#EBE7DF] dark:border-[#2D2520] rounded-2xl">
                        <h4 className="flex items-center gap-1.5 font-bold text-[#7D756D] dark:text-[#A89F95] text-xs uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5 text-[#2E5AAC] dark:text-[#93B4F5]" />
                          <span>Order Processing & Dispatch Timeline</span>
                        </h4>

                        <div className="space-y-2.5 pt-1">
                          {order.timeline.map((event, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs">
                              <div
                                className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${event.completed ? 'bg-emerald-500' : 'bg-[#DBD5C8]'
                                  }`}
                              ></div>
                              <div>
                                <p className="font-bold text-[#1C1613] dark:text-[#F7F4EF]">
                                  {event.title}
                                </p>
                                <p className="text-[#7D756D] text-[11px] dark:text-[#A89F95]">
                                  {event.description}
                                </p>
                                <span className="font-mono text-[#8F867C] text-[10px]">
                                  {event.timestamp} • {event.operator}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="space-y-4 bg-white dark:bg-[#1A1512] shadow-2xl p-6 border border-[#EBE7DF] dark:border-[#2D2520] rounded-3xl w-full max-w-lg">
            <h3 className="font-black text-[#1C1613] dark:text-white text-base">
              Create New Solar Wholesale Order
            </h3>
            <p className="text-[#7D756D] dark:text-[#A89F95] text-xs">
              Generate proforma booking and reserve equipment at Bhiwandi Central Depot.
            </p>

            <form onSubmit={handleCreateOrder} className="space-y-3">
              <div>
                <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                  Customer Contact Person
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Patil"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                  Company / EPC Contractor Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Projects Solar / SunGrid EPC"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs"
                />
              </div>

              <div className="gap-3 grid grid-cols-2">
                <div>
                  <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                    Destination City / Site
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pune / Sanand / Jaipur"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                    Estimated Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(parseInt(e.target.value) || 0)}
                    className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full font-bold text-[#1C1613] dark:text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                  Logistics Transporter
                </label>
                <select
                  value={newTransporter}
                  onChange={(e) => setNewTransporter(e.target.value as any)}
                  className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-[#FAF7F2] text-xs"
                >
                  <option value="V-Trans India">V-Trans India (Fleet partner)</option>
                  <option value="Safexpress">Safexpress Multi-axle</option>
                  <option value="TCI Express">TCI Express Industrial</option>
                  <option value="Delhivery Freight">Delhivery Freight Eicher</option>
                </select>
              </div>

              <div className="flex justify-end items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="hover:bg-[#F4F0E8] px-4 py-2 rounded-xl font-semibold text-[#7D756D] text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#FCD34D] hover:bg-[#fbbf24] shadow-xs px-4 py-2.5 rounded-xl font-bold text-[#1C1613] text-xs"
                >
                  Confirm & Allocate Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

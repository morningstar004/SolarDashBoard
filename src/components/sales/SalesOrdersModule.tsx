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
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>('SO-9102'); // Open first order by default
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Order Form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newAmount, setNewAmount] = useState<number>(850000);
  const [newTransporter, setNewTransporter] = useState<
    'V-Trans India' | 'TCI Express' | 'Safexpress' | 'Delhivery Freight'
  >('V-Trans India');

  // Filter orders according to the horizontal options
  const filteredOrders = orders.filter((order) => {
    // 1. Pipeline filter
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

    // 2. Search filter
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.logistics.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.destinationCity.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPipeline && matchesSearch;
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-500" />
            <span>Sales & Order Lifecycle Management</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor incoming customer demand, milestone fulfillment, and equipment allocation.
          </p>
        </div>

        {/* Horizontal Option Bar on the Top Right (Requested by user) */}
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-750 self-start lg:self-auto">
          <button
            onClick={() => setPipelineFilter('ONGOING')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              pipelineFilter === 'ONGOING'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ongoing Orders ({orders.filter((o) => o.status === 'Confirmed' || o.status === 'Processing' || o.status === 'In Transit').length})
          </button>

          <button
            onClick={() => setPipelineFilter('PENDING_QC')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              pipelineFilter === 'PENDING_QC'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pending QC Inspection ({orders.filter((o) => o.status === 'Ready for Inspection' || o.status === 'Pre-Dispatch Approved').length})
          </button>

          <button
            onClick={() => setPipelineFilter('DELIVERED_HISTORY')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              pipelineFilter === 'DELIVERED_HISTORY'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Delivered / History ({orders.filter((o) => o.status === 'Delivered').length})
          </button>

          <button
            onClick={() => setPipelineFilter('CANCELLED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              pipelineFilter === 'CANCELLED'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Cancelled ({orders.filter((o) => o.status === 'Cancelled').length})
          </button>

          <button
            onClick={() => setPipelineFilter('ALL')}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              pipelineFilter === 'ALL'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({orders.length})
          </button>
        </div>
      </div>

      {/* Subheader Search and Create Order action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Order ID, Client, Transporter, Destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Sales Order</span>
        </button>
      </div>

      {/* Orders List with Expandable Detailed Timeline & BOS Items */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            No orders match the current filter selection.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            const statusBadgeColor =
              order.status === 'Pre-Dispatch Approved'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300'
                : order.status === 'In Transit'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300'
                : order.status === 'Ready for Inspection'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 animate-pulse'
                : order.status === 'Delivered'
                ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300'
                : 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300';

            // Items other than solar panels (BOS, inverters, racking, cables)
            const otherThanPanels = order.items.filter((i) => i.category !== 'Panels');

            return (
              <div
                key={order.id}
                className={`rounded-2xl border transition-all ${
                  isExpanded
                    ? 'bg-white dark:bg-slate-900 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Main Order Row */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Column: Order ID & Customer */}
                  <div className="flex items-start gap-3 min-w-[220px]">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-mono font-bold flex items-center justify-center text-xs shrink-0 border border-amber-200 dark:border-amber-800/40">
                      SO
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                          {order.id}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          {order.urgency}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {order.customer.name}
                      </p>
                      <p className="text-[11px] text-slate-400">{order.customer.company}</p>
                    </div>
                  </div>

                  {/* Middle Column 1: Purchased Merchandise summary */}
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Purchased Merchandise</p>
                    <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-1 font-medium mt-0.5">
                      {order.items.map((i) => `${i.productName.split(' ')[0]} ${i.category} (x${i.requiredQty})`).join(', ')}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {order.items.length} line items • Destination: {order.customer.destinationCity}
                    </p>
                  </div>

                  {/* Middle Column 2: Logistics Partner & Vehicle */}
                  <div className="min-w-[150px]">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Logistics Partner</p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {order.logistics.partner}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      {order.logistics.vehicleNumber}
                    </p>
                  </div>

                  {/* Amount & Status */}
                  <div className="flex items-center justify-between md:justify-end gap-4 min-w-[190px]">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Amount</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusBadgeColor}`}
                      >
                        {order.status}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section: Extended Timeline + BOS Items */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 rounded-b-2xl space-y-4">
                    {/* Action Bar inside Expanded Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500">
                          Assigned Trader:{' '}
                          <strong className="text-slate-800 dark:text-slate-200">
                            {order.assignedTrader}
                          </strong>
                        </span>
                        <span className="text-slate-500">
                          QC Inspector:{' '}
                          <strong className="text-slate-800 dark:text-slate-200">
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
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
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
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          <Truck className="w-3.5 h-3.5 text-amber-500" />
                          <span>View Live GPS Fleet Tracking</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Left: Extra Products provided other than solar panels */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-amber-500" />
                          <span>Balance of System (BOS) & Non-Panel Equipment</span>
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Inverters, battery energy storage, mounting structures & DC cables supplied:
                        </p>

                        <div className="space-y-1.5 pt-1">
                          {otherThanPanels.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">Only PV Modules on this order.</p>
                          ) : (
                            otherThanPanels.map((item) => (
                              <div
                                key={item.productId}
                                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                              >
                                <div>
                                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                                    {item.productName}
                                  </span>
                                  <div className="text-[10px] text-slate-400">
                                    {item.brand} • {item.category}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-slate-900 dark:text-white">
                                    {item.requiredQty} units
                                  </span>
                                  <div className="text-[10px] text-slate-400">
                                    ₹{item.unitPrice.toLocaleString('en-IN')}/unit
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Right: Milestone Timeline */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-sky-500" />
                          <span>Order Processing & Dispatch Timeline</span>
                        </h4>

                        <div className="space-y-2.5 pt-1">
                          {order.timeline.map((event, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs">
                              <div
                                className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                                  event.completed ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                                }`}
                              ></div>
                              <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">
                                  {event.title}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {event.description}
                                </p>
                                <span className="text-[10px] text-slate-400 font-mono">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create New Solar Wholesale Order
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate proforma booking and reserve equipment at Bhiwandi Central Depot.
            </p>

            <form onSubmit={handleCreateOrder} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Customer Contact Person
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Patil"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company / EPC Contractor Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Projects Solar / SunGrid EPC"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Destination City / Site
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pune / Sanand / Jaipur"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(parseInt(e.target.value) || 0)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Logistics Transporter
                </label>
                <select
                  value={newTransporter}
                  onChange={(e) => setNewTransporter(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  <option value="V-Trans India">V-Trans India (Fleet partner)</option>
                  <option value="Safexpress">Safexpress Multi-axle</option>
                  <option value="TCI Express">TCI Express Industrial</option>
                  <option value="Delhivery Freight">Delhivery Freight Eicher</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
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


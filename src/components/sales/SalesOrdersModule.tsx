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

  // Filter orders according to the horizontal options
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)]">
        <div>
          <h2 className="text-base font-black text-[#1C1613] dark:text-[#F7F4EF] flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#A87208] dark:text-[#FCD34D]" />
            <span>Sales & Order Lifecycle Management</span>
          </h2>
          <p className="text-xs text-[#7D756D] dark:text-[#A89F95] mt-0.5">
            Monitor incoming customer demand, milestone fulfillment, and equipment allocation.
          </p>
        </div>

        {/* Horizontal Option Bar on the Top Right (Pill style matching reference image) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#F4F0E8] dark:bg-[#241E19] border border-[#EBE7DF] dark:border-[#352B24] self-start lg:self-auto">
          <button
            onClick={() => setPipelineFilter('ONGOING')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              pipelineFilter === 'ONGOING'
                ? 'bg-[#1C1613] dark:bg-[#FCD34D] text-white dark:text-[#1C1613] shadow-xs'
                : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613] dark:hover:text-white'
            }`}
          >
            Ongoing ({orders.filter((o) => o.status === 'Confirmed' || o.status === 'Processing' || o.status === 'In Transit').length})
          </button>

          <button
            onClick={() => setPipelineFilter('PENDING_QC')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              pipelineFilter === 'PENDING_QC'
                ? 'bg-[#1C1613] dark:bg-[#FCD34D] text-white dark:text-[#1C1613] shadow-xs'
                : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613] dark:hover:text-white'
            }`}
          >
            Pending QC ({orders.filter((o) => o.status === 'Ready for Inspection' || o.status === 'Pre-Dispatch Approved').length})
          </button>

          <button
            onClick={() => setPipelineFilter('DELIVERED_HISTORY')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              pipelineFilter === 'DELIVERED_HISTORY'
                ? 'bg-[#1C1613] dark:bg-[#FCD34D] text-white dark:text-[#1C1613] shadow-xs'
                : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613] dark:hover:text-white'
            }`}
          >
            Delivered ({orders.filter((o) => o.status === 'Delivered').length})
          </button>

          <button
            onClick={() => setPipelineFilter('CANCELLED')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              pipelineFilter === 'CANCELLED'
                ? 'bg-[#1C1613] dark:bg-[#FCD34D] text-white dark:text-[#1C1613] shadow-xs'
                : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613] dark:hover:text-white'
            }`}
          >
            Cancelled ({orders.filter((o) => o.status === 'Cancelled').length})
          </button>

          <button
            onClick={() => setPipelineFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              pipelineFilter === 'ALL'
                ? 'bg-[#1C1613] dark:bg-[#FCD34D] text-white dark:text-[#1C1613] shadow-xs'
                : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613] dark:hover:text-white'
            }`}
          >
            All ({orders.length})
          </button>
        </div>
      </div>

      {/* Subheader Search and Create Order action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8F867C]" />
          <input
            type="text"
            placeholder="Search Order ID, Client, Transporter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#1A1512] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
          />
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#FCD34D] hover:bg-[#fbbf24] text-[#1C1613] shadow-md shadow-[#FCD34D]/20 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create New Sales Order</span>
        </button>
      </div>

      {/* Orders List with Expandable Detailed Timeline & BOS Items */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] text-[#8F867C] text-xs">
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
                className={`rounded-3xl border transition-all ${
                  isExpanded
                    ? 'bg-white dark:bg-[#1A1512] border-[#FCD34D] shadow-md'
                    : 'bg-white dark:bg-[#1A1512] border-[#EBE7DF] dark:border-[#2D2520] hover:border-[#DBD5C8]'
                }`}
              >
                {/* Main Order Row */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Column: Order ID & Customer */}
                  <div className="flex items-start gap-3 min-w-[220px]">
                    <div className="w-10 h-10 rounded-2xl bg-[#FEF6E6] dark:bg-[#2D2115] text-[#C27E0C] dark:text-[#FCD34D] font-mono font-black flex items-center justify-center text-xs shrink-0 border border-[#FDE3B2] dark:border-[#4B3722]">
                      SO
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-[#1C1613] dark:text-white">
                          {order.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4F0E8] dark:bg-[#28201A] text-[#5C5247] dark:text-[#D4CCC0] font-bold">
                          {order.urgency}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#1C1613] dark:text-[#F7F4EF] mt-0.5">
                        {order.customer.name}
                      </p>
                      <p className="text-[11px] text-[#7D756D] dark:text-[#A89F95]">{order.customer.company}</p>
                    </div>
                  </div>

                  {/* Middle Column 1: Purchased Merchandise summary */}
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-[10px] text-[#8F867C] uppercase font-bold">Purchased Merchandise</p>
                    <p className="text-xs text-[#1C1613] dark:text-[#FAF7F2] line-clamp-1 font-semibold mt-0.5">
                      {order.items.map((i) => `${i.productName.split(' ')[0]} ${i.category} (x${i.requiredQty})`).join(', ')}
                    </p>
                    <p className="text-[11px] text-[#7D756D] dark:text-[#A89F95] mt-0.5">
                      {order.items.length} line items • Destination: {order.customer.destinationCity}
                    </p>
                  </div>

                  {/* Middle Column 2: Logistics Partner & Vehicle */}
                  <div className="min-w-[150px]">
                    <p className="text-[10px] text-[#8F867C] uppercase font-bold">Logistics Partner</p>
                    <p className="text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mt-0.5">
                      {order.logistics.partner}
                    </p>
                    <p className="text-[11px] font-mono text-[#7D756D] dark:text-[#A89F95]">
                      {order.logistics.vehicleNumber}
                    </p>
                  </div>

                  {/* Amount & Status */}
                  <div className="flex items-center justify-between md:justify-end gap-4 min-w-[190px]">
                    <div>
                      <p className="text-[10px] text-[#8F867C] uppercase font-bold">Total Amount</p>
                      <p className="text-sm font-black text-[#1C1613] dark:text-white">
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
                  <div className="p-5 border-t border-[#EBE7DF] dark:border-[#2D2520] bg-[#FBF9F5]/70 dark:bg-[#16120F] rounded-b-3xl space-y-4">
                    {/* Action Bar inside Expanded Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EBE7DF] dark:border-[#2D2520] text-xs">
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
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FCD34D] hover:bg-[#fbbf24] text-[#1C1613] shadow-xs"
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
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#1A1512] hover:bg-[#F4F0E8] border border-[#EBE7DF] dark:border-[#2D2520] text-[#1C1613] dark:text-white"
                        >
                          <Truck className="w-3.5 h-3.5 text-[#C27E0C] dark:text-[#FCD34D]" />
                          <span>View Live GPS Fleet Tracking</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Left: Extra Products provided other than solar panels */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#7D756D] dark:text-[#A89F95] flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#C27E0C] dark:text-[#FCD34D]" />
                          <span>Balance of System (BOS) & Non-Panel Equipment</span>
                        </h4>
                        <p className="text-[11px] text-[#8F867C]">
                          Inverters, battery energy storage, mounting structures & DC cables supplied:
                        </p>

                        <div className="space-y-1.5 pt-1">
                          {otherThanPanels.length === 0 ? (
                            <p className="text-xs text-[#8F867C] italic">Only PV Modules on this order.</p>
                          ) : (
                            otherThanPanels.map((item) => (
                              <div
                                key={item.productId}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] text-xs"
                              >
                                <div>
                                  <span className="font-bold text-[#1C1613] dark:text-[#F7F4EF]">
                                    {item.productName}
                                  </span>
                                  <div className="text-[10px] text-[#7D756D] dark:text-[#A89F95]">
                                    {item.brand} • {item.category}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-black text-[#1C1613] dark:text-white">
                                    {item.requiredQty} units
                                  </span>
                                  <div className="text-[10px] text-[#8F867C]">
                                    ₹{item.unitPrice.toLocaleString('en-IN')}/unit
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Right: Milestone Timeline */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#7D756D] dark:text-[#A89F95] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#2E5AAC] dark:text-[#93B4F5]" />
                          <span>Order Processing & Dispatch Timeline</span>
                        </h4>

                        <div className="space-y-2.5 pt-1">
                          {order.timeline.map((event, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs">
                              <div
                                className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                                  event.completed ? 'bg-emerald-500' : 'bg-[#DBD5C8]'
                                }`}
                              ></div>
                              <div>
                                <p className="font-bold text-[#1C1613] dark:text-[#F7F4EF]">
                                  {event.title}
                                </p>
                                <p className="text-[11px] text-[#7D756D] dark:text-[#A89F95]">
                                  {event.description}
                                </p>
                                <span className="text-[10px] text-[#8F867C] font-mono">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-[#1A1512] rounded-3xl border border-[#EBE7DF] dark:border-[#2D2520] shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-[#1C1613] dark:text-white">
              Create New Solar Wholesale Order
            </h3>
            <p className="text-xs text-[#7D756D] dark:text-[#A89F95]">
              Generate proforma booking and reserve equipment at Bhiwandi Central Depot.
            </p>

            <form onSubmit={handleCreateOrder} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
                  Customer Contact Person
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Patil"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
                  Company / EPC Contractor Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Projects Solar / SunGrid EPC"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
                    Destination City / Site
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pune / Sanand / Jaipur"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
                    Estimated Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(parseInt(e.target.value) || 0)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
                  Logistics Transporter
                </label>
                <select
                  value={newTransporter}
                  onChange={(e) => setNewTransporter(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2]"
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7D756D] hover:bg-[#F4F0E8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#FCD34D] hover:bg-[#fbbf24] text-[#1C1613] shadow-xs"
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

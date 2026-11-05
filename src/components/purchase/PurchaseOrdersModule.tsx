'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PurchaseOrder, POStatus } from '@/types';
import {
  FileInput,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  IndianRupee,
  Calendar,
  Building,
  PackageCheck,
  ChevronDown,
  ChevronUp,
  X,
  Boxes,
} from 'lucide-react';

export const PurchaseOrdersModule: React.FC = () => {
  const { purchaseOrders, products, createPurchaseOrder, receivePOItems, setActiveTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [expandedPoId, setExpandedPoId] = useState<string | null>('PO-IN-4801');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [receiveModalPO, setReceiveModalPO] = useState<PurchaseOrder | null>(null);
  const [receivedMap, setReceivedMap] = useState<Record<string, number>>({});

  // New PO form state
  const [supplierName, setSupplierName] = useState('Waaree Energies Ltd');
  const [supplierCity, setSupplierCity] = useState('Surat, Gujarat');
  const [expectedDate, setExpectedDate] = useState('2026-11-18');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || 'prod-p1');
  const [poQty, setPoQty] = useState(100);
  const [poNotes, setPoNotes] = useState('Inbound restock for high-demand commercial projects');

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierCity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenReceiveModal = (po: PurchaseOrder) => {
    setReceiveModalPO(po);
    const initialMap: Record<string, number> = {};
    po.items.forEach((item) => {
      const remaining = Math.max(0, item.orderedQty - item.receivedQty);
      initialMap[item.productId] = remaining;
    });
    setReceivedMap(initialMap);
  };

  const handleConfirmReceive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiveModalPO) return;
    receivePOItems(receiveModalPO.id, receivedMap);
    setReceiveModalPO(null);
  };

  const handleCreatePOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProduct = products.find((p) => p.id === selectedProductId) || products[0];
    const total = targetProduct.unitCost * poQty;

    createPurchaseOrder({
      supplierName,
      supplierCity,
      expectedDeliveryDate: expectedDate,
      totalAmount: total,
      status: 'Sent to Supplier',
      items: [
        {
          productId: targetProduct.id,
          productName: targetProduct.name,
          category: targetProduct.category,
          brand: targetProduct.brand,
          orderedQty: poQty,
          receivedQty: 0,
          unitCost: targetProduct.unitCost,
        },
      ],
      paymentTerms: '20% Advance, 80% on Dispatch Against LR Copy',
      gstNumber: '24AAACW8890M1Z2',
      notes: poNotes,
    });

    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileInput className="w-5 h-5 text-amber-500" />
            <span>Purchase Order (PO) & Inbound Supplier Management</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Procurement pipelines from Tier-1 Indian manufacturers and receiving dock replenishment.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Raise New Purchase Order</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search PO ID, Manufacturer, City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Sent to Supplier">Sent to Supplier</option>
          <option value="Partially Received">Partially Received</option>
          <option value="Received & Stocked">Received & Stocked</option>
        </select>
      </div>

      {/* Purchase Orders List */}
      <div className="space-y-3">
        {filteredPOs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            No purchase orders found matching this filter.
          </div>
        ) : (
          filteredPOs.map((po) => {
            const isExpanded = expandedPoId === po.id;
            const statusBg =
              po.status === 'Received & Stocked'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300'
                : po.status === 'Partially Received'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300'
                : po.status === 'Sent to Supplier'
                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border-sky-300'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300';

            return (
              <div
                key={po.id}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
              >
                {/* PO Header Row */}
                <div
                  onClick={() => setExpandedPoId(isExpanded ? null : po.id)}
                  className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-mono font-bold flex items-center justify-center text-xs shrink-0 border border-amber-200 dark:border-amber-800/40">
                      PO
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                          {po.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBg}`}>
                          {po.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {po.supplierName} ({po.supplierCity})
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 min-w-[180px]">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Ordered Equipment</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate mt-0.5">
                      {po.items.map((i) => `${i.productName} (x${i.orderedQty})`).join(', ')}
                    </p>
                  </div>

                  <div className="min-w-[140px]">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Delivery Target</span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium mt-0.5">
                      {po.expectedDeliveryDate}
                    </p>
                    <p className="text-[10px] text-slate-400">Issued: {po.orderDate}</p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 min-w-[160px]">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Landed</span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        ₹{po.totalAmount.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {po.status !== 'Received & Stocked' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReceiveModal(po);
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                        >
                          Receive
                        </button>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Line Items & Fulfillment Status */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                      <span>Payment Terms: <strong className="text-slate-800 dark:text-slate-200">{po.paymentTerms}</strong></span>
                      <span>Supplier GSTIN: <strong className="font-mono text-slate-800 dark:text-slate-200">{po.gstNumber}</strong></span>
                      <span>Notes: <strong className="text-slate-800 dark:text-slate-200">{po.notes}</strong></span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Line Items & Inbound Fulfillment
                      </h4>
                      {po.items.map((item) => {
                        const isFullyReceived = item.receivedQty >= item.orderedQty;
                        return (
                          <div
                            key={item.productId}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 gap-2"
                          >
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">
                                {item.productName}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {item.brand} • {item.category} • Cost: ₹{item.unitCost.toLocaleString('en-IN')}/unit
                              </p>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-left sm:text-right">
                                <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                                  {item.receivedQty} of {item.orderedQty} units received
                                </span>
                                <div className="w-32 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-1 overflow-hidden">
                                  <div
                                    className={`h-full ${isFullyReceived ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                    style={{ width: `${Math.min(100, (item.receivedQty / item.orderedQty) * 100)}%` }}
                                  ></div>
                                </div>
                              </div>

                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  isFullyReceived
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                }`}
                              >
                                {isFullyReceived ? 'Fully Stocked' : 'Pending Dock Arrival'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Receive Inbound Goods Modal */}
      {receiveModalPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-emerald-500" />
                  <span>Receive Inbound Shipment ({receiveModalPO.id})</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  From: {receiveModalPO.supplierName} ({receiveModalPO.supplierCity})
                </p>
              </div>
              <button
                onClick={() => setReceiveModalPO(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReceive} className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                Receiving these items will automatically increment warehouse inventory levels at Bhiwandi Depot.
              </div>

              {receiveModalPO.items.map((item) => (
                <div key={item.productId} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.productName}
                    </span>
                    <span className="text-slate-400">
                      Already received: {item.receivedQty} / {item.orderedQty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={item.orderedQty - item.receivedQty}
                      value={receivedMap[item.productId] || 0}
                      onChange={(e) =>
                        setReceivedMap({
                          ...receivedMap,
                          [item.productId]: parseInt(e.target.value) || 0,
                        })
                      }
                      className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                    <span className="text-xs text-slate-500">units to add to stock</span>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setReceiveModalPO(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Confirm Physical Receipt & Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Raise Inbound Purchase Order (PO)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Contract order to manufacturer for inventory replenishment.
            </p>

            <form onSubmit={handleCreatePOSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Solar Manufacturer
                  </label>
                  <select
                    value={supplierName}
                    onChange={(e) => {
                      setSupplierName(e.target.value);
                      if (e.target.value === 'Waaree Energies Ltd') setSupplierCity('Surat, Gujarat');
                      if (e.target.value === 'Sungrow Power Supply') setSupplierCity('Bengaluru, Karnataka');
                      if (e.target.value === 'Polycab India Ltd') setSupplierCity('Halol, Gujarat');
                      if (e.target.value === 'Luminous Power Technologies') setSupplierCity('Gurugram, Haryana');
                      if (e.target.value === 'Tata Power Solar') setSupplierCity('Bengaluru, Karnataka');
                    }}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Waaree Energies Ltd">Waaree Energies Ltd</option>
                    <option value="Tata Power Solar">Tata Power Solar</option>
                    <option value="Sungrow Power Supply">Sungrow Power Supply</option>
                    <option value="Polycab India Ltd">Polycab India Ltd</option>
                    <option value="Luminous Power Technologies">Luminous Power Technologies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Supplier Facility City
                  </label>
                  <input
                    type="text"
                    value={supplierCity}
                    onChange={(e) => setSupplierCity(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Equipment Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category}) — Unit Cost: ₹{p.unitCost.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Order Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={poQty}
                    onChange={(e) => setPoQty(parseInt(e.target.value) || 1)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expected Arrival Date
                  </label>
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Procurement Notes & Allocation
                </label>
                <textarea
                  rows={2}
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
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
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

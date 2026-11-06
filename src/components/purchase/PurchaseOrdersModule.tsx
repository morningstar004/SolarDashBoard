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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-3xl bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)]">
        <div>
          <h2 className="text-base font-black text-[#1C1613] dark:text-[#F7F4EF] flex items-center gap-2">
            <FileInput className="w-5 h-5 text-[#A87208] dark:text-[#FCD34D]" />
            <span>Purchase Order (PO) & Inbound Supplier Management</span>
          </h2>
          <p className="text-xs text-[#7D756D] dark:text-[#A89F95] mt-0.5">
            Procurement pipelines from Tier-1 Indian manufacturers and receiving dock replenishment.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#FCD34D] hover:bg-[#fbbf24] text-[#1C1613] shadow-md shadow-[#FCD34D]/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Raise New Purchase Order</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8F867C]" />
          <input
            type="text"
            placeholder="Search PO ID, Manufacturer, City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#1A1512] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A1512] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
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
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)]">
            <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF6E6] dark:bg-[#2D2115] text-[#A87208] dark:text-[#FCD34D] flex items-center justify-center">
                <FileInput className="w-5 h-5" />
              </div>
              <p className="font-bold text-sm text-[#1C1613] dark:text-white">
                No Purchase Orders Matched
              </p>
              <p className="text-xs text-[#8F867C] dark:text-[#A89F95]">
                No POs found for &quot;{searchQuery || statusFilter}&quot;. Try resetting your filters.
              </p>
              {(searchQuery || statusFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FCD34D] text-[#1C1613] hover:bg-[#fbbf24] transition-all"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredPOs.map((po) => {
            const isExpanded = expandedPoId === po.id;
            const statusBg =
              po.status === 'Received & Stocked'
                ? 'bg-[#E8F8F0] text-[#168051] border-[#C6EED8] dark:bg-[#1A2D22] dark:text-[#78E0A9]'
                : po.status === 'Partially Received'
                ? 'bg-[#FEF6E6] text-[#A6680C] border-[#FDE3B2] dark:bg-[#2D2115] dark:text-[#FCD34D]'
                : po.status === 'Sent to Supplier'
                ? 'bg-[#EEF4FF] text-[#2E5AAC] border-[#CCDDFE] dark:bg-[#1E2638] dark:text-[#93B4F5]'
                : 'bg-[#F4F0E8] text-[#5C5247] border-[#E5DFD4] dark:bg-[#2A221C] dark:text-[#D4CCC0]';

            return (
              <div
                key={po.id}
                className="rounded-3xl dark:border dark:border-[#2D2520] bg-white dark:bg-[#1A1512] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] overflow-hidden"
              >
                {/* PO Header Row */}
                <div
                  onClick={() => setExpandedPoId(isExpanded ? null : po.id)}
                  className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FBF9F5]/70 dark:hover:bg-[#201A16]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FEF6E6] dark:bg-[#2D2115] text-[#C27E0C] dark:text-[#FCD34D] font-mono font-black flex items-center justify-center text-xs shrink-0 border border-[#FDE3B2] dark:border-[#4B3722]">
                      PO
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-[#1C1613] dark:text-white">
                          {po.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBg}`}>
                          ● {po.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#1C1613] dark:text-[#F7F4EF] mt-0.5">
                        {po.supplierName} ({po.supplierCity})
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 min-w-[180px]">
                    <span className="text-[10px] text-[#8F867C] uppercase font-bold">Ordered Equipment</span>
                    <p className="text-xs text-[#1C1613] dark:text-[#FAF7F2] font-semibold truncate mt-0.5">
                      {po.items.map((i) => `${i.productName} (x${i.orderedQty})`).join(', ')}
                    </p>
                  </div>

                  <div className="min-w-[140px]">
                    <span className="text-[10px] text-[#8F867C] uppercase font-bold">Delivery Target</span>
                    <p className="text-xs text-[#1C1613] dark:text-[#FAF7F2] font-bold mt-0.5">
                      {po.expectedDeliveryDate}
                    </p>
                    <p className="text-[10px] text-[#7D756D] dark:text-[#A89F95]">Issued: {po.orderDate}</p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 min-w-[160px]">
                    <div>
                      <span className="text-[10px] text-[#8F867C] uppercase font-bold">Total Landed</span>
                      <p className="text-sm font-black text-[#1C1613] dark:text-white">
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
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FCD34D] hover:bg-[#fbbf24] text-[#1C1613] shadow-xs transition-all"
                        >
                          Receive
                        </button>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#8F867C]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#8F867C]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Line Items & Fulfillment Status */}
                {isExpanded && (
                  <div className="p-5 border-t border-[#EBE7DF] dark:border-[#2D2520] bg-[#FBF9F5] dark:bg-[#201A16] text-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EBE7DF] dark:border-[#2D2520] text-[11px] text-[#7D756D] dark:text-[#A89F95]">
                      <span>Payment Terms: <strong className="text-[#1C1613] dark:text-[#FAF7F2]">{po.paymentTerms}</strong></span>
                      <span>Supplier GSTIN: <strong className="font-mono text-[#1C1613] dark:text-[#FAF7F2]">{po.gstNumber}</strong></span>
                      <span>Notes: <strong className="text-[#1C1613] dark:text-[#FAF7F2]">{po.notes}</strong></span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#8F867C]">
                        Line Items & Inbound Fulfillment
                      </h4>
                      {po.items.map((item) => {
                        const isFullyReceived = item.receivedQty >= item.orderedQty;
                        return (
                          <div
                            key={item.productId}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] gap-2 shadow-xs"
                          >
                            <div>
                              <p className="font-bold text-[#1C1613] dark:text-white">
                                {item.productName}
                              </p>
                              <p className="text-[11px] text-[#7D756D] dark:text-[#A89F95]">
                                {item.brand} • {item.category} • Cost: ₹{item.unitCost.toLocaleString('en-IN')}/unit
                              </p>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-left sm:text-right">
                                <span className="font-mono font-bold text-xs text-[#1C1613] dark:text-[#FAF7F2]">
                                  {item.receivedQty} of {item.orderedQty} units received
                                </span>
                                <div className="w-32 h-1.5 rounded-full bg-[#F4F0E8] dark:bg-[#28201A] mt-1 overflow-hidden">
                                  <div
                                    className={`h-full ${isFullyReceived ? 'bg-emerald-500' : 'bg-[#FCD34D]'}`}
                                    style={{ width: `${Math.min(100, (item.receivedQty / item.orderedQty) * 100)}%` }}
                                  ></div>
                                </div>
                              </div>

                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  isFullyReceived
                                    ? 'bg-[#E8F8F0] text-[#168051] border-[#C6EED8] dark:bg-[#1A2D22] dark:text-[#78E0A9]'
                                    : 'bg-[#FEF6E6] text-[#A6680C] border-[#FDE3B2] dark:bg-[#2D2115] dark:text-[#FCD34D]'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1613]/60 backdrop-blur-sm">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1A1512] rounded-3xl dark:border dark:border-[#2D2520] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#1C1613] dark:text-white flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-emerald-600" />
                  <span>Receive Inbound Shipment ({receiveModalPO.id})</span>
                </h3>
                <p className="text-xs text-[#7D756D] dark:text-[#A89F95]">
                  From: {receiveModalPO.supplierName} ({receiveModalPO.supplierCity})
                </p>
              </div>
              <button
                onClick={() => setReceiveModalPO(null)}
                className="p-1.5 rounded-xl text-[#8F867C] hover:text-[#1C1613] hover:bg-[#F4F0E8] dark:hover:bg-[#28201A] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReceive} className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#E8F8F0] dark:bg-[#1A2D22] border border-[#C6EED8] dark:border-[#2C4837] text-xs text-[#168051] dark:text-[#78E0A9] font-medium">
                Receiving these items will automatically increment warehouse inventory levels at Bhiwandi Depot.
              </div>

              {receiveModalPO.items.map((item) => (
                <div key={item.productId} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#1C1613] dark:text-white">
                      {item.productName}
                    </span>
                    <span className="text-[#8F867C]">
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
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    />
                    <span className="text-xs text-[#7D756D]">units to add to stock</span>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setReceiveModalPO(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#7D756D] hover:bg-[#F4F0E8] dark:hover:bg-[#28201A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1613]/60 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1A1512] rounded-3xl dark:border dark:border-[#2D2520] shadow-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-black text-[#1C1613] dark:text-white">
                Raise Inbound Purchase Order (PO)
              </h3>
              <p className="text-xs text-[#7D756D] dark:text-[#A89F95] mt-0.5">
                Contract order to manufacturer for inventory replenishment.
              </p>
            </div>

            <form onSubmit={handleCreatePOSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
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
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                  >
                    <option value="Waaree Energies Ltd">Waaree Energies Ltd</option>
                    <option value="Tata Power Solar">Tata Power Solar</option>
                    <option value="Sungrow Power Supply">Sungrow Power Supply</option>
                    <option value="Polycab India Ltd">Polycab India Ltd</option>
                    <option value="Luminous Power Technologies">Luminous Power Technologies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
                    Supplier Facility City
                  </label>
                  <input
                    type="text"
                    value={supplierCity}
                    onChange={(e) => setSupplierCity(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
                  Equipment Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
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
                  <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
                    Order Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={poQty}
                    onChange={(e) => setPoQty(parseInt(e.target.value) || 1)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
                    Expected Arrival Date
                  </label>
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
                  Procurement Notes & Allocation
                </label>
                <textarea
                  rows={2}
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#7D756D] hover:bg-[#F4F0E8] dark:hover:bg-[#28201A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl text-xs font-bold bg-[#FCD34D] hover:bg-[#fbbf24] text-[#1C1613] shadow-xs transition-all"
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


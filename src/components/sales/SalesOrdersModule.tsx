'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Check,
  X,
  Boxes,
  Building2,
  Trash2,
} from 'lucide-react';

export const SalesOrdersModule: React.FC = () => {
  const {
    orders,
    products,
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
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const filterPopupRef = useRef<HTMLDivElement>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>('SO-9102');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Close filter popup on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterPopupRef.current && !filterPopupRef.current.contains(event.target as Node)) {
        setShowFilterPopup(false);
      }
    };
    if (showFilterPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterPopup]);

  // Comprehensive Delivery Booking Form state
  const [newCustomerName, setNewCustomerName] = useState('Rameshwar Patil');
  const [newCustomerPhone, setNewCustomerPhone] = useState('+91 98201 45892');
  const [newCustomerEmail, setNewCustomerEmail] = useState('rameshwar.patil@sungridepc.in');
  const [newCompanyName, setNewCompanyName] = useState('SunGrid EPC Solutions Pvt Ltd');
  const [newCustomerTier, setNewCustomerTier] = useState<'Tier-1 EPC' | 'Commercial Developer' | 'Rooftop Installer'>('Tier-1 EPC');
  const [newCustomerGstin, setNewCustomerGstin] = useState('27AABCS1429Q1ZX');

  // Delivery Site & Address Details
  const [newSiteAddress, setNewSiteAddress] = useState('Plot 44, Talegaon GIDC Industrial Area');
  const [newCity, setNewCity] = useState('Pune');
  const [newState, setNewState] = useState('Maharashtra');
  const [newPincode, setNewPincode] = useState('410507');
  const [newUnloadingType, setNewUnloadingType] = useState('Forklift Ramp / Loading Dock');

  // Selected Equipment Line Items
  const [selectedItems, setSelectedItems] = useState<Array<{
    productId: string;
    productName: string;
    brand: string;
    category: string;
    qty: number;
    unitPrice: number;
  }>>([
    {
      productId: 'prod-p1',
      productName: 'Waaree 545W Bifacial Mono-PERC Module',
      brand: 'Waaree Energies',
      category: 'Panels',
      qty: 48,
      unitPrice: 12400,
    },
    {
      productId: 'prod-i1',
      productName: 'Sungrow SG50CX 50kW Grid-Tie Inverter',
      brand: 'Sungrow',
      category: 'Inverters',
      qty: 2,
      unitPrice: 168000,
    },
  ]);
  const [itemToAdd, setItemToAdd] = useState<string>('');

  // Logistics & Freight Carrier Details
  const [newUrgency, setNewUrgency] = useState<'Standard' | 'High Priority' | 'Critical Project'>('High Priority');
  const [newTransporter, setNewTransporter] = useState<
    'V-Trans India' | 'TCI Express' | 'Safexpress' | 'Delhivery Freight' | 'Gati-KWE'
  >('V-Trans India');
  const [newVehicleNumber, setNewVehicleNumber] = useState('MH 04 AB 9123');
  const [newVehicleType, setNewVehicleType] = useState('24ft Heavy Open Bed');
  const [newDriverName, setNewDriverName] = useState('Suresh Gaikwad');
  const [newDriverPhone, setNewDriverPhone] = useState('+91 97110 44291');
  const [newEWayBill, setNewEWayBill] = useState('EWB-2710-994821');
  const [newDeliveryDate, setNewDeliveryDate] = useState('2026-11-09');
  const [newHandlingInstructions, setNewHandlingInstructions] = useState('Fragile Glass Panels (Do Not Double Stack) • Waterproof Tarpaulin Required');
  const [newPaymentTerms, setNewPaymentTerms] = useState('100% Advance via RTGS/NEFT');

  const handleAddItem = (prodId: string) => {
    if (!prodId) return;
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;

    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.productId === prodId);
      if (exists) {
        return prev.map((i) =>
          i.productId === prodId ? { ...i, qty: i.qty + (prod.category === 'Panels' ? 24 : 1) } : i
        );
      }
      return [
        ...prev,
        {
          productId: prod.id,
          productName: prod.name,
          brand: prod.brand,
          category: prod.category,
          qty: prod.category === 'Panels' ? 48 : prod.category === 'Cabling' ? 4 : 2,
          unitPrice: prod.sellingPrice,
        },
      ];
    });
    setItemToAdd('');
  };

  const handleRemoveItem = (prodId: string) => {
    setSelectedItems((prev) => prev.filter((i) => i.productId !== prodId));
  };

  const handleQtyChange = (prodId: string, qty: number) => {
    setSelectedItems((prev) =>
      prev.map((i) => (i.productId === prodId ? { ...i, qty: Math.max(1, qty) } : i))
    );
  };

  const totalCalculatedAmount = selectedItems.reduce(
    (acc, item) => acc + item.qty * item.unitPrice,
    0
  );

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

    const finalAmount = totalCalculatedAmount > 0 ? totalCalculatedAmount : 650000;

    createSalesOrder({
      customer: {
        name: newCustomerName,
        company: newCompanyName,
        tier: newCustomerTier,
        contact:
          newCustomerEmail ||
          `${newCustomerName.toLowerCase().replace(/\s+/g, '.')}@${newCompanyName.toLowerCase().replace(/\s+/g, '')}.in`,
        phone: newCustomerPhone || '+91 98201 45892',
        destinationCity: `${newCity}, ${newState}`,
        state: newState,
        fullAddress: `${newSiteAddress}, ${newCity}, ${newState} - ${newPincode} (Unloading: ${newUnloadingType})`,
        gstin: newCustomerGstin || '27AABCS1429Q1ZX',
      },
      items:
        selectedItems.length > 0
          ? selectedItems.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              brand: item.brand,
              category: item.category as any,
              requiredQty: item.qty,
              packedQty: item.qty,
              unitPrice: item.unitPrice,
              conditionCheck: {
                factorySeal: true,
                visualPassed: true,
                qcTested: true,
                palletStrapped: true,
              },
            }))
          : [
              {
                productId: 'prod-p1',
                productName: 'Waaree 545W Bifacial Mono-PERC Module',
                brand: 'Waaree Energies',
                category: 'Panels',
                requiredQty: 48,
                packedQty: 48,
                unitPrice: 12400,
              },
            ],
      totalAmount: finalAmount,
      urgency: newUrgency,
      logistics: {
        partner: newTransporter as any,
        vehicleNumber: newVehicleNumber || 'MH 04 AB 9123',
        driverName: newDriverName || 'Suresh Gaikwad',
        driverPhone: newDriverPhone || '+91 97110 44291',
        trailerType: newVehicleType,
        lrNumber:
          newEWayBill ||
          `LR-${newTransporter.slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
        estimatedDeliveryDate: `${newDeliveryDate} 17:00 IST`,
      },
    });

    setShowCreateModal(false);
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
      <div className="flex xl:flex-row flex-col justify-between items-stretch xl:items-center gap-3">
        <div className="flex flex-wrap flex-1 items-center gap-2.5">
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

          {/* Combined Filter Button with Options Popup */}
          <div className="relative" ref={filterPopupRef}>
            <button
              onClick={() => setShowFilterPopup((prev) => !prev)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${dateFilter !== 'ALL' || orderTypeFilter !== 'ALL' || showFilterPopup
                  ? 'bg-[#1C1613] text-[#FCD34D] border-[#1C1613] dark:bg-[#FCD34D] dark:text-[#1C1613] dark:border-[#FCD34D] shadow-sm'
                  : 'bg-white dark:bg-[#1A1512] text-[#5C5247] dark:text-[#D4CCC0] border-[#E8E3DA] dark:border-[#352B24] hover:border-[#D4CDC1]'
                }`}
              title="Filter by Date and Order Type"
            >
              <Filter className="w-3.5 h-3.5 shrink-0" />
              <span>Filter</span>
              {(dateFilter !== 'ALL' || orderTypeFilter !== 'ALL') && (
                <span className="flex justify-center items-center bg-[#FCD34D] dark:bg-[#1C1613] rounded-full w-4 h-4 font-black text-[#1C1613] text-[10px] dark:text-[#FCD34D]">
                  {(dateFilter !== 'ALL' ? 1 : 0) + (orderTypeFilter !== 'ALL' ? 1 : 0)}
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${showFilterPopup ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {/* Combined Options Popup */}
            {showFilterPopup && (
              <div className="left-0 z-50 absolute bg-white dark:bg-[#1E1815] shadow-2xl mt-2 p-4 border border-[#E8E3DA] dark:border-[#352B24] rounded-2xl w-80 sm:w-96 text-[#1C1613] dark:text-[#F7F4EF]">
                {/* Popup Header */}
                <div className="flex justify-between items-center pb-3 border-[#F0EBE1] dark:border-[#2E251E] border-b">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#A87208] dark:text-[#FCD34D]" />
                    <span className="font-black text-xs uppercase tracking-wider">
                      Filter Orders
                    </span>
                  </div>
                  {(dateFilter !== 'ALL' || orderTypeFilter !== 'ALL') && (
                    <button
                      onClick={() => {
                        setDateFilter('ALL');
                        setOrderTypeFilter('ALL');
                      }}
                      className="font-bold text-[11px] text-rose-600 dark:text-rose-400 hover:underline"
                    >
                      Reset All
                    </button>
                  )}
                </div>

                {/* Option 1: Date and its sub-options */}
                <div className="py-3 border-[#F0EBE1] dark:border-[#2E251E] border-b">
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-1.5 font-bold text-[#1C1613] dark:text-[#F7F4EF] text-xs">
                      <Calendar className="w-3.5 h-3.5 text-[#A87208] dark:text-[#FCD34D]" />
                      Date
                    </span>
                    {dateFilter !== 'ALL' && (
                      <span className="bg-[#FEF6E6] dark:bg-[#2D2115] px-1.5 py-0.5 rounded-md font-bold text-[#A6680C] text-[10px] dark:text-[#FCD34D]">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="gap-1.5 grid grid-cols-2">
                    {[
                      { id: 'ALL', label: 'All Dates' },
                      { id: 'TODAY', label: 'Today (Nov 5-6)' },
                      { id: 'LAST_7_DAYS', label: 'Last 7 Days' },
                      { id: 'THIS_MONTH', label: 'This Month (Nov)' },
                      { id: 'LAST_MONTH', label: 'Last Month (Oct)' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setDateFilter(option.id)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-left transition-all ${dateFilter === option.id
                            ? 'bg-[#1C1613] text-white dark:bg-[#FCD34D] dark:text-[#1C1613] font-bold shadow-xs'
                            : 'bg-[#FBF9F5] dark:bg-[#28211B] text-[#5C5247] dark:text-[#D4CCC0] hover:bg-[#F4F0E8] dark:hover:bg-[#342B23]'
                          }`}
                      >
                        <span className="truncate">{option.label}</span>
                        {dateFilter === option.id && (
                          <Check className="stroke-[3] ml-1 w-3 h-3 text-[#FCD34D] dark:text-[#1C1613] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Option 2: Order Type and its sub-options */}
                <div className="pt-3 pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-1.5 font-bold text-[#1C1613] dark:text-[#F7F4EF] text-xs">
                      <Layers className="w-3.5 h-3.5 text-[#A87208] dark:text-[#FCD34D]" />
                      Type of Order
                    </span>
                    {orderTypeFilter !== 'ALL' && (
                      <span className="bg-[#FEF6E6] dark:bg-[#2D2115] px-1.5 py-0.5 rounded-md font-bold text-[#A6680C] text-[10px] dark:text-[#FCD34D]">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 pr-0.5 max-h-48 overflow-y-auto">
                    {[
                      { id: 'ALL', label: 'All Order Types', desc: 'Display all types' },
                      { id: 'Tier-1 EPC', label: 'Tier-1 EPC', desc: 'Utility scale projects' },
                      { id: 'Commercial Developer', label: 'Commercial & Industrial', desc: 'Factory & warehouse solar' },
                      { id: 'Rooftop Installer', label: 'Rooftop Solar Installer', desc: 'Residential & SMB systems' },
                      { id: 'CRITICAL_PRIORITY', label: 'Critical / High Priority', desc: 'Express priority dispatches' },
                      { id: 'HAS_BATTERIES', label: 'BESS / Battery Storage', desc: 'Orders containing LiFePO4 batteries' },
                      { id: 'HAS_INVERTERS', label: 'Inverters Only', desc: 'Inverters replacement & expansion' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setOrderTypeFilter(option.id)}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-left transition-all ${orderTypeFilter === option.id
                            ? 'bg-[#1C1613] text-white dark:bg-[#FCD34D] dark:text-[#1C1613] font-bold shadow-xs'
                            : 'bg-[#FBF9F5] dark:bg-[#28211B] text-[#5C5247] dark:text-[#D4CCC0] hover:bg-[#F4F0E8] dark:hover:bg-[#342B23]'
                          }`}
                      >
                        <div className="pr-2 min-w-0">
                          <div className="font-bold text-[11px] truncate leading-tight">
                            {option.label}
                          </div>
                          <div
                            className={`text-[10px] leading-tight truncate ${orderTypeFilter === option.id ? 'opacity-80' : 'text-[#8F867C]'
                              }`}
                          >
                            {option.desc}
                          </div>
                        </div>
                        {orderTypeFilter === option.id && (
                          <Check className="stroke-[3] w-3.5 h-3.5 text-[#FCD34D] dark:text-[#1C1613] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer Action inside popup */}
                <div className="mt-1 pt-3 border-[#F0EBE1] dark:border-[#2E251E] border-t">
                  <button
                    onClick={() => setShowFilterPopup(false)}
                    className="bg-[#FCD34D] hover:bg-[#fbbf24] shadow-xs px-3 py-2 rounded-xl w-full font-bold text-[#1C1613] text-xs text-center transition-all"
                  >
                    Apply Filters ({filteredOrders.length} results)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active Filter Chips beside the Filter Button for quick dismissal */}
          {dateFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 bg-[#FEF6E6] dark:bg-[#2D2115] px-2.5 py-1 border border-[#FDE3B2] dark:border-[#4B3722] rounded-xl font-bold text-[#A6680C] text-[11px] dark:text-[#FCD34D]">
              <span>
                Date:{' '}
                {dateFilter === 'TODAY'
                  ? 'Today'
                  : dateFilter === 'LAST_7_DAYS'
                    ? 'Last 7 Days'
                    : dateFilter === 'THIS_MONTH'
                      ? 'This Month'
                      : 'Last Month'}
              </span>
              <button
                onClick={() => setDateFilter('ALL')}
                className="p-0.5 rounded-full hover:text-rose-600 dark:hover:text-rose-400"
                title="Remove date filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {orderTypeFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 bg-[#EEF4FF] dark:bg-[#1E2638] px-2.5 py-1 border border-[#CCDDFE] dark:border-[#2A3752] rounded-xl font-bold text-[#2E5AAC] text-[11px] dark:text-[#93B4F5]">
              <span>
                Type:{' '}
                {orderTypeFilter === 'Tier-1 EPC'
                  ? 'Tier-1 EPC'
                  : orderTypeFilter === 'Commercial Developer'
                    ? 'Commercial'
                    : orderTypeFilter === 'Rooftop Installer'
                      ? 'Rooftop'
                      : orderTypeFilter === 'CRITICAL_PRIORITY'
                        ? 'Critical'
                        : orderTypeFilter === 'HAS_BATTERIES'
                          ? 'Batteries'
                          : 'Inverters'}
              </span>
              <button
                onClick={() => setOrderTypeFilter('ALL')}
                className="p-0.5 rounded-full hover:text-rose-600 dark:hover:text-rose-400"
                title="Remove type filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Quick Clear All Button when filters or search are active */}
          {(dateFilter !== 'ALL' || orderTypeFilter !== 'ALL' || searchQuery.trim() !== '') && (
            <button
              onClick={() => {
                setDateFilter('ALL');
                setOrderTypeFilter('ALL');
                setSearchQuery('');
              }}
              className="hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2.5 py-1.5 rounded-lg font-bold text-[11px] text-rose-600 dark:text-rose-400 whitespace-nowrap transition-colors"
            >
              Reset All
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
          <div className="bg-white dark:bg-[#1A1512] p-8 dark:border-[#2D2520] rounded-3xl text-[#8F867C] text-xs text-center">
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

      {/* Redesigned Comprehensive Delivery Booking Modal */}
      {showCreateModal && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1411] shadow-2xl border border-[#EBE7DF] dark:border-[#2D2520] rounded-3xl w-full max-w-4xl my-auto overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EBE1] dark:border-[#2D2520] bg-[#FAF8F5] dark:bg-[#201915]">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#FEF6E6] dark:bg-[#2D2115] text-[#C27E0C] dark:text-[#FCD34D] border border-[#FDE3B2] dark:border-[#4B3722]">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-[#1C1613] dark:text-white text-base">
                      Commercial Solar Delivery Booking
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FCD34D]/20 text-[#8B6200] dark:text-[#FCD34D] border border-[#FCD34D]/30">
                      Bhiwandi Central Depot
                    </span>
                  </div>
                  <p className="text-[#7D756D] dark:text-[#A89F95] text-xs">
                    Configure consignee details, delivery site unloading access, cargo line items, freight carrier, and statutory e-way billing.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-xl text-[#7D756D] hover:text-[#1C1613] dark:hover:text-white hover:bg-[#F4F0E8] dark:hover:bg-[#2B221B] transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateOrder} className="overflow-y-auto p-6 space-y-6 flex-1">
              {/* Section 1: Consignee & Customer Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#A87208] dark:text-[#FCD34D]">
                  <Building2 className="w-4 h-4" />
                  <span>1. Consignee & Client Information</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Company / EPC Contractor Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SunGrid EPC Solutions Pvt Ltd"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Customer Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rameshwar Patil"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Customer Contact Mobile *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98201 45892"
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                      className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Procurement Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="procurement@sungridepc.in"
                      value={newCustomerEmail}
                      onChange={(e) => setNewCustomerEmail(e.target.value)}
                      className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      GSTIN Identification Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="27AABCS1429Q1ZX"
                      value={newCustomerGstin}
                      onChange={(e) => setNewCustomerGstin(e.target.value.toUpperCase())}
                      className="font-mono bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Client Business Tier
                    </label>
                    <select
                      value={newCustomerTier}
                      onChange={(e) => setNewCustomerTier(e.target.value as any)}
                      className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    >
                      <option value="Tier-1 EPC">Tier-1 EPC (Utility-Scale MW)</option>
                      <option value="Commercial Developer">Commercial & Industrial (C&I)</option>
                      <option value="Rooftop Installer">Rooftop Solar EPC / SMB</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Site & Access Specifications */}
              <div className="space-y-3 pt-3 border-t border-[#F0EBE1] dark:border-[#2D2520]">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#A87208] dark:text-[#FCD34D]">
                  <MapPin className="w-4 h-4" />
                  <span>2. Delivery Site Destination & Unloading Facilities</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Complete Site Delivery Address & Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Plot 44, GIDC Industrial Corridor, Talegaon"
                      value={newSiteAddress}
                      onChange={(e) => setNewSiteAddress(e.target.value)}
                      className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Destination City / District *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maharashtra"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Postal Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="410507"
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      className="font-mono bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Site Unloading Conditions *
                    </label>
                    <select
                      value={newUnloadingType}
                      onChange={(e) => setNewUnloadingType(e.target.value)}
                      className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    >
                      <option value="Forklift Ramp / Loading Dock">Forklift & Dock Ramp Available</option>
                      <option value="Crane Required (Rooftop)">Crane / Boom Truck Required</option>
                      <option value="Ground Mount Flat Terrain">Ground Mount Flat Access</option>
                      <option value="Manual Labour Team">Manual Labour Unloading Team</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Statutory E-Way Bill / LR Reference Number
                    </label>
                    <input
                      type="text"
                      placeholder="EWB-2710-994821"
                      value={newEWayBill}
                      onChange={(e) => setNewEWayBill(e.target.value)}
                      className="font-mono bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Equipment Manifest & Inventory Allocation */}
              <div className="space-y-3 pt-3 border-t border-[#F0EBE1] dark:border-[#2D2520]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#A87208] dark:text-[#FCD34D]">
                    <Boxes className="w-4 h-4" />
                    <span>3. Equipment Allocation & Cargo Items</span>
                  </div>

                  {/* Dispatch Urgency Selector */}
                  <div className="flex items-center gap-1.5 bg-[#F4F0E8] dark:bg-[#241E19] p-1 rounded-xl">
                    <span className="text-[10px] font-bold text-[#7D756D] dark:text-[#A89F95] px-2">
                      Urgency:
                    </span>
                    {(['Standard', 'High Priority', 'Critical Project'] as const).map((urg) => (
                      <button
                        type="button"
                        key={urg}
                        onClick={() => setNewUrgency(urg)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          newUrgency === urg
                            ? urg === 'Critical Project'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-[#1C1613] text-white dark:bg-[#FCD34D] dark:text-[#1C1613] shadow-xs'
                            : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613]'
                        }`}
                      >
                        {urg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Allocated Line Items Table */}
                <div className="border border-[#EBE7DF] dark:border-[#2E251E] rounded-2xl overflow-hidden bg-[#FAF8F5] dark:bg-[#1C1613]">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F0EBE1] dark:bg-[#241D18] text-[#7D756D] dark:text-[#A89F95] uppercase font-bold text-[10px]">
                      <tr>
                        <th className="px-3.5 py-2">Product & Brand</th>
                        <th className="px-3 py-2">Category</th>
                        <th className="px-3 py-2 text-right">Unit Price</th>
                        <th className="px-3 py-2 text-center">Dispatch Qty</th>
                        <th className="px-3.5 py-2 text-right">Subtotal</th>
                        <th className="px-2 py-2 text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE7DF] dark:divide-[#2E251E]">
                      {selectedItems.map((item) => (
                        <tr key={item.productId} className="hover:bg-white/60 dark:hover:bg-[#221B17]/60">
                          <td className="px-3.5 py-2.5 font-bold text-[#1C1613] dark:text-[#FAF7F2]">
                            <div>{item.productName}</div>
                            <span className="text-[10px] text-[#7D756D] dark:text-[#A89F95] font-normal">
                              {item.brand}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8E3DA] dark:bg-[#2E251E] text-[#5C5247] dark:text-[#D4CCC0]">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono font-medium text-[#1C1613] dark:text-[#FAF7F2]">
                            ₹{item.unitPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleQtyChange(item.productId, item.qty - 1)}
                                className="w-6 h-6 rounded-lg bg-[#E8E3DA] dark:bg-[#2E251E] hover:bg-[#DDD7CC] text-[#1C1613] dark:text-white font-black text-xs flex items-center justify-center"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.qty}
                                onChange={(e) =>
                                  handleQtyChange(item.productId, parseInt(e.target.value) || 1)
                                }
                                className="w-16 px-1.5 py-0.5 text-center font-bold font-mono text-xs bg-white dark:bg-[#16120F] border border-[#E8E3DA] dark:border-[#352B24] rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => handleQtyChange(item.productId, item.qty + 1)}
                                className="w-6 h-6 rounded-lg bg-[#E8E3DA] dark:bg-[#2E251E] hover:bg-[#DDD7CC] text-[#1C1613] dark:text-white font-black text-xs flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-3.5 py-2.5 text-right font-mono font-black text-[#1C1613] dark:text-[#FCD34D]">
                            ₹{(item.qty * item.unitPrice).toLocaleString('en-IN')}
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.productId)}
                              className="text-rose-500 hover:text-rose-700 p-1 rounded-lg"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Add Equipment Item Row */}
                  <div className="p-3 bg-[#F4F0E8]/70 dark:bg-[#201915]/70 border-t border-[#EBE7DF] dark:border-[#2E251E] flex flex-col sm:flex-row items-center gap-2">
                    <span className="text-xs font-bold text-[#7D756D] dark:text-[#A89F95] shrink-0">
                      Add Product from Depot Stock:
                    </span>
                    <select
                      value={itemToAdd}
                      onChange={(e) => {
                        setItemToAdd(e.target.value);
                        if (e.target.value) handleAddItem(e.target.value);
                      }}
                      className="bg-white dark:bg-[#1A1512] px-3 py-1.5 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl text-xs font-medium flex-1 text-[#1C1613] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    >
                      <option value="">-- Select solar panel, inverter, battery or BOS item --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.brand}) • ₹{p.sellingPrice.toLocaleString('en-IN')} • In Stock: {p.inStock}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Freight Carrier & Vehicle Allocation */}
              <div className="space-y-3 pt-3 border-t border-[#F0EBE1] dark:border-[#2D2520]">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#A87208] dark:text-[#FCD34D]">
                  <Truck className="w-4 h-4" />
                  <span>4. Freight Logistics Carrier & Driver Allocation</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Logistics Partner *
                    </label>
                    <select
                      value={newTransporter}
                      onChange={(e) => setNewTransporter(e.target.value as any)}
                      className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    >
                      <option value="V-Trans India">V-Trans India (Dedicated Solar Fleet)</option>
                      <option value="Safexpress">Safexpress Multi-axle Heavy</option>
                      <option value="TCI Express">TCI Express Industrial Special</option>
                      <option value="Delhivery Freight">Delhivery Freight Eicher Fleet</option>
                      <option value="Gati-KWE">Gati-KWE Surface Express</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Assigned Vehicle Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MH 04 AB 9123"
                      value={newVehicleNumber}
                      onChange={(e) => setNewVehicleNumber(e.target.value.toUpperCase())}
                      className="font-mono bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Vehicle Trailer Type
                    </label>
                    <select
                      value={newVehicleType}
                      onChange={(e) => setNewVehicleType(e.target.value)}
                      className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    >
                      <option value="24ft Heavy Open Bed">24ft Heavy Open Bed (Palletized)</option>
                      <option value="32ft Multi-Axle Container">32ft Multi-Axle Container (Weatherproof)</option>
                      <option value="14ft Eicher Covered Box">14ft Eicher Covered Box (BOS & Cabling)</option>
                      <option value="Dedicated Hot-Shot Container">Dedicated Hot-Shot Container (Urgent)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Assigned Driver / Pilot Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Suresh Gaikwad"
                      value={newDriverName}
                      onChange={(e) => setNewDriverName(e.target.value)}
                      className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Pilot Mobile Number
                    </label>
                    <input
                      type="text"
                      placeholder="+91 97110 44291"
                      value={newDriverPhone}
                      onChange={(e) => setNewDriverPhone(e.target.value)}
                      className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Target Delivery Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newDeliveryDate}
                      onChange={(e) => setNewDeliveryDate(e.target.value)}
                      className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Special Handling & Cargo Safety Instructions
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Fragile Glass Panels (Do Not Double Stack) • Waterproof Tarpaulin Required"
                      value={newHandlingInstructions}
                      onChange={(e) => setNewHandlingInstructions(e.target.value)}
                      className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-[#1C1613] dark:text-[#FAF7F2] text-xs">
                      Commercial Payment Terms
                    </label>
                    <select
                      value={newPaymentTerms}
                      onChange={(e) => setNewPaymentTerms(e.target.value)}
                      className="bg-[#F8F5EE] dark:bg-[#221B17] px-3 py-2 border border-[#E8E3DA] dark:border-[#352B24] rounded-xl w-full text-[#1C1613] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                    >
                      <option value="100% Advance via RTGS/NEFT">100% Advance via RTGS/NEFT</option>
                      <option value="20% Advance + 80% on Dispatch">20% Advance + 80% on Dispatch</option>
                      <option value="LC at Sight (Bank Guarantee)">LC at Sight (Bank Guarantee)</option>
                      <option value="Net 30 Days Credit (Tier-1 EPC)">Net 30 Days Credit (Tier-1 EPC)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Footer with Live Valuation & Actions */}
              <div className="pt-4 mt-4 border-t border-[#F0EBE1] dark:border-[#2D2520] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF8F5] dark:bg-[#1E1714] -mx-6 -mb-6 p-6">
                <div>
                  <span className="text-[11px] uppercase font-bold text-[#7D756D] dark:text-[#A89F95]">
                    Total Cargo Valuation (excl. GST):
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-[#1C1613] dark:text-[#FCD34D]">
                      ₹{totalCalculatedAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#7D756D] dark:text-[#A89F95]">
                      ({selectedItems.reduce((acc, i) => acc + i.qty, 0)} units • {selectedItems.length} lines)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2.5 rounded-2xl font-bold text-[#7D756D] hover:text-[#1C1613] dark:hover:text-white hover:bg-[#EBE5DA] dark:hover:bg-[#2B221B] text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-[#FCD34D] hover:bg-[#fbbf24] shadow-md shadow-[#FCD34D]/20 px-6 py-2.5 rounded-2xl font-black text-[#1C1613] text-xs transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Confirm & Generate Booking</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

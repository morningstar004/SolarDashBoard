'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Order,
  PurchaseOrder,
  Employee,
  NonPermanentContractor,
  OrderStatus,
  ChecklistPhoto,
  DiscrepancyReport,
  WorkloadStatus,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_EMPLOYEES,
  INITIAL_CONTRACTORS,
} from '../data/mockData';

export type TabType = 'dashboard' | 'inventory' | 'sales' | 'checklist' | 'purchase' | 'team' | 'tracking';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface AppContextType {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Active navigation
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Selection states
  selectedOrderIdForChecklist: string;
  setSelectedOrderIdForChecklist: (orderId: string) => void;
  selectedOrderIdForTracking: string;
  setSelectedOrderIdForTracking: (orderId: string) => void;

  // Data
  products: Product[];
  orders: Order[];
  purchaseOrders: PurchaseOrder[];
  employees: Employee[];
  contractors: NonPermanentContractor[];

  // Mutators
  adjustProductStock: (productId: string, deltaQty: number, reason: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateItemPackedQty: (orderId: string, productId: string, qty: number) => void;
  updateItemCondition: (
    orderId: string,
    productId: string,
    condition: { factorySeal: boolean; visualPassed: boolean; qcTested: boolean; palletStrapped: boolean }
  ) => void;
  addChecklistPhoto: (orderId: string, photo: ChecklistPhoto) => void;
  addDiscrepancy: (orderId: string, discrepancy: DiscrepancyReport) => void;
  signoffChecklist: (
    orderId: string,
    signoff: {
      packerName: string;
      supervisorName: string;
      supervisorRemarks: string;
      sealNumber: string;
    }
  ) => void;
  createSalesOrder: (newOrder: Partial<Order>) => void;
  createPurchaseOrder: (newPO: Partial<PurchaseOrder>) => void;
  receivePOItems: (poId: string, receivedMap: Record<string, number>) => void;
  assignOrder: (orderId: string, trader: string, inspector: string) => void;
  updateEmployeeStatus: (empId: string, status: WorkloadStatus) => void;
  bookContractor: (contractorId: string, projectNote: string) => void;

  // Toasts
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedOrderIdForChecklist, setSelectedOrderIdForChecklist] = useState<string>('SO-9102');
  const [selectedOrderIdForTracking, setSelectedOrderIdForTracking] = useState<string>('SO-9102');

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [contractors, setContractors] = useState<NonPermanentContractor[]>(INITIAL_CONTRACTORS);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Initialize theme from system or saved
  useEffect(() => {
    const savedTheme = localStorage.getItem('helios_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('helios_theme', next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Adjust product stock
  const adjustProductStock = (productId: string, deltaQty: number, reason: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const newStock = Math.max(0, prod.inStock + deltaQty);
          const newStatus =
            newStock === 0 ? 'Out of Stock' : newStock <= prod.lowStockThreshold ? 'Low Stock' : 'In Stock';
          return { ...prod, inStock: newStock, status: newStatus };
        }
        return prod;
      })
    );
    addToast({
      title: 'Stock Updated',
      message: `Adjusted by ${deltaQty > 0 ? '+' + deltaQty : deltaQty} units (${reason}).`,
      type: 'info',
    });
  };

  // Update order status with safety guard
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);

    // Critical check: cannot dispatch without checklist approval!
    if (status === 'Dispatched' && targetOrder && targetOrder.status !== 'Pre-Dispatch Approved' && !targetOrder.checklistSignoff) {
      addToast({
        title: 'Dispatch Blocked by Safety Interlock',
        message: 'Order must undergo Pre-Dispatch Verification and receive Supervisor Sign-off before vehicle loading.',
        type: 'error',
      });
      return;
    }

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = [
            ...ord.timeline,
            {
              title: `Status Changed to ${status}`,
              timestamp: 'Just now',
              description: `Order milestone updated to ${status} on dispatch floor`,
              operator: 'Current User',
              completed: true,
            },
          ];
          return { ...ord, status, timeline: updatedTimeline };
        }
        return ord;
      })
    );
    addToast({
      title: 'Order Status Updated',
      message: `${orderId} moved to "${status}"`,
      type: 'success',
    });
  };

  // Pre-dispatch packing quantities
  const updateItemPackedQty = (orderId: string, productId: string, qty: number) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedItems = ord.items.map((item) => {
            if (item.productId === productId) {
              return { ...item, packedQty: Math.max(0, Math.min(item.requiredQty, qty)) };
            }
            return item;
          });
          return { ...ord, items: updatedItems };
        }
        return ord;
      })
    );
  };

  // Update item condition check
  const updateItemCondition = (
    orderId: string,
    productId: string,
    condition: { factorySeal: boolean; visualPassed: boolean; qcTested: boolean; palletStrapped: boolean }
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedItems = ord.items.map((item) => {
            if (item.productId === productId) {
              return { ...item, conditionCheck: condition };
            }
            return item;
          });
          return { ...ord, items: updatedItems };
        }
        return ord;
      })
    );
  };

  // Add photo to checklist
  const addChecklistPhoto = (orderId: string, photo: ChecklistPhoto) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const existingPhotos = ord.photos || [];
          return { ...ord, photos: [...existingPhotos, photo] };
        }
        return ord;
      })
    );
    addToast({
      title: 'Evidence Attached',
      message: `${photo.stage} photo successfully saved to dock dispatch file.`,
      type: 'success',
    });
  };

  // Flag discrepancy
  const addDiscrepancy = (orderId: string, discrepancy: DiscrepancyReport) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const existing = ord.discrepancies || [];
          return { ...ord, discrepancies: [...existing, discrepancy] };
        }
        return ord;
      })
    );
    addToast({
      title: 'Discrepancy Logged',
      message: `${discrepancy.type} reported on ${discrepancy.productName}.`,
      type: 'warning',
    });
  };

  // Supervisor Signoff
  const signoffChecklist = (
    orderId: string,
    signoff: {
      packerName: string;
      supervisorName: string;
      supervisorRemarks: string;
      sealNumber: string;
    }
  ) => {
    const token = `SIG-VERIF-${Date.now().toString(36).toUpperCase()}-${signoff.supervisorName.replace(/\s+/g, '').toUpperCase()}`;
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = [
            ...ord.timeline,
            {
              title: 'Pre-Dispatch Verified & Signed Off',
              timestamp,
              description: `Supervisor ${signoff.supervisorName} stamped approval with Seal #${signoff.sealNumber}`,
              operator: signoff.supervisorName,
              completed: true,
            },
          ];
          return {
            ...ord,
            status: 'Pre-Dispatch Approved' as OrderStatus,
            checklistSignoff: {
              packerName: signoff.packerName,
              packerVerifiedAt: timestamp,
              supervisorName: signoff.supervisorName,
              supervisorRemarks: signoff.supervisorRemarks,
              supervisorSignedAt: timestamp,
              digitalSignatureToken: token,
              sealNumber: signoff.sealNumber,
            },
            timeline: updatedTimeline,
          };
        }
        return ord;
      })
    );

    addToast({
      title: 'Pre-Dispatch Verification Complete! 🚀',
      message: `Order ${orderId} is authorized for transporter vehicle loading with Seal #${signoff.sealNumber}.`,
      type: 'success',
    });
  };

  // Create Sales Order
  const createSalesOrder = (newOrderData: Partial<Order>) => {
    const newId = `SO-${Math.floor(9100 + Math.random() * 899)}`;
    const fullOrder: Order = {
      id: newId,
      customer: newOrderData.customer || {
        name: 'Authorized Solar EPC',
        company: 'Solar Infra Projects Ltd',
        tier: 'Tier-1 EPC',
        contact: 'procurement@solarinfra.in',
        phone: '+91 98200 44100',
        destinationCity: 'Nagpur Solar Hub',
        state: 'Maharashtra',
        fullAddress: 'Plot 18, Butibori Industrial Estate, Nagpur 441108',
        gstin: '27AABCS9912K1Z9',
      },
      items: newOrderData.items || [],
      logistics: newOrderData.logistics || {
        partner: 'V-Trans India',
        vehicleNumber: 'MH 12 RN 8812',
        driverName: 'Ramesh Jadhav',
        driverPhone: '+91 98221 00412',
        trailerType: '24ft Flatbed Container',
        lrNumber: `VT-LR-${Math.floor(10000 + Math.random() * 90000)}`,
        estimatedDeliveryDate: '2026-11-09 17:00 IST',
      },
      orderDate: new Date().toISOString().split('T')[0],
      totalAmount: newOrderData.totalAmount || 550000,
      status: 'Confirmed',
      urgency: newOrderData.urgency || 'Standard',
      assignedTrader: newOrderData.assignedTrader || 'Suresh Nair',
      assignedInspector: newOrderData.assignedInspector || 'Priya Patel',
      timeline: [
        {
          title: 'Sales Order Raised',
          timestamp: 'Just now',
          description: 'Order created via HeliosOps Command Center',
          operator: 'Trader Suresh Nair',
          completed: true,
        },
      ],
      photos: [],
      discrepancies: [],
    };

    setOrders((prev) => [fullOrder, ...prev]);
    addToast({
      title: 'Order Created',
      message: `Sales Order ${newId} confirmed for ${fullOrder.customer.company}.`,
      type: 'success',
    });
  };

  // Create Purchase Order
  const createPurchaseOrder = (newPOData: Partial<PurchaseOrder>) => {
    const newId = `PO-IN-${Math.floor(4800 + Math.random() * 500)}`;
    const fullPO: PurchaseOrder = {
      id: newId,
      supplierName: newPOData.supplierName || 'Waaree Energies Ltd',
      supplierCity: newPOData.supplierCity || 'Surat, Gujarat',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: newPOData.expectedDeliveryDate || '2026-11-15',
      totalAmount: newPOData.totalAmount || 1200000,
      status: 'Sent to Supplier',
      items: newPOData.items || [],
      paymentTerms: '20% Advance, 80% on Dispatch',
      gstNumber: newPOData.gstNumber || '24AAACW8890M1Z2',
      notes: newPOData.notes || 'Inbound replenishment order',
    };

    setPurchaseOrders((prev) => [fullPO, ...prev]);
    addToast({
      title: 'Purchase Order Issued',
      message: `${newId} sent to ${fullPO.supplierName}.`,
      type: 'success',
    });
  };

  // Receive PO items -> updates PO status and auto-increments product stock!
  const receivePOItems = (poId: string, receivedMap: Record<string, number>) => {
    // 1. Update PO items
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id === poId) {
          const updatedItems = po.items.map((item) => {
            const added = receivedMap[item.productId] || 0;
            const newRcvd = Math.min(item.orderedQty, item.receivedQty + added);
            return { ...item, receivedQty: newRcvd };
          });
          const allDone = updatedItems.every((i) => i.receivedQty >= i.orderedQty);
          const someDone = updatedItems.some((i) => i.receivedQty > 0);
          const newStatus = allDone ? 'Received & Stocked' : someDone ? 'Partially Received' : po.status;
          return { ...po, items: updatedItems, status: newStatus };
        }
        return po;
      })
    );

    // 2. Increment product inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const added = receivedMap[prod.id];
        if (added && added > 0) {
          const newStock = prod.inStock + added;
          const newStatus = newStock > prod.lowStockThreshold ? 'In Stock' : 'Low Stock';
          return { ...prod, inStock: newStock, status: newStatus };
        }
        return prod;
      })
    );

    addToast({
      title: 'Inbound Delivery Received & Stocked',
      message: `Verified and added items to warehouse inventory from ${poId}.`,
      type: 'success',
    });
  };

  // Assign Order
  const assignOrder = (orderId: string, trader: string, inspector: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return { ...ord, assignedTrader: trader, assignedInspector: inspector };
        }
        return ord;
      })
    );
    addToast({
      title: 'Order Reassigned',
      message: `${orderId} assigned to ${trader} (Trader) & ${inspector} (QC).`,
      type: 'info',
    });
  };

  // Update employee status
  const updateEmployeeStatus = (empId: string, status: WorkloadStatus) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === empId ? { ...emp, status } : emp))
    );
    addToast({
      title: 'Team Status Updated',
      message: `Status updated to ${status}.`,
      type: 'info',
    });
  };

  // Book contractor
  const bookContractor = (contractorId: string, projectNote: string) => {
    setContractors((prev) =>
      prev.map((c) =>
        c.id === contractorId ? { ...c, status: 'On Assignment', recentProject: projectNote } : c
      )
    );
    addToast({
      title: 'Contractor Booked',
      message: `Contractor assigned to ${projectNote}. Call notification sent.`,
      type: 'success',
    });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        selectedOrderIdForChecklist,
        setSelectedOrderIdForChecklist,
        selectedOrderIdForTracking,
        setSelectedOrderIdForTracking,
        products,
        orders,
        purchaseOrders,
        employees,
        contractors,
        adjustProductStock,
        updateOrderStatus,
        updateItemPackedQty,
        updateItemCondition,
        addChecklistPhoto,
        addDiscrepancy,
        signoffChecklist,
        createSalesOrder,
        createPurchaseOrder,
        receivePOItems,
        assignOrder,
        updateEmployeeStatus,
        bookContractor,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

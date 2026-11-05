'use client';

import React from 'react';
import { useApp, TabType } from '@/context/AppContext';
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  ClipboardCheck,
  Truck,
  FileInput,
  Users,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, orders, products, purchaseOrders } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;

  const readyForInspectionCount = orders.filter(
    (o) => o.status === 'Ready for Inspection'
  ).length;

  const lowStockCount = products.filter(
    (p) => p.status === 'Low Stock' || p.status === 'Out of Stock'
  ).length;

  const navItems: {
    id: TabType;
    label: string;
    sublabel: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      sublabel: 'KPIs, Spline & Bar Charts',
      icon: LayoutDashboard,
    },
    {
      id: 'inventory',
      label: 'Solar Inventory',
      sublabel: 'Equipment Stock & Pricing',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} alert` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
    },
    {
      id: 'sales',
      label: 'Sales & Orders',
      sublabel: 'Outbound Demand & Pipelines',
      icon: ShoppingCart,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300',
    },
    {
      id: 'checklist',
      label: 'Pre-Dispatch Checklist',
      sublabel: 'Warehouse Loading Gate QC',
      icon: ClipboardCheck,
      badge: readyForInspectionCount > 0 ? `${readyForInspectionCount} Ready` : 'QC Dock',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-semibold',
    },
    {
      id: 'tracking',
      label: 'Order Tracking & Fleet',
      sublabel: 'Vehicle GPS & Dispatch Logs',
      icon: Truck,
    },
    {
      id: 'purchase',
      label: 'Purchase Orders (PO)',
      sublabel: 'Inbound Supplier Goods',
      icon: FileInput,
      badge: purchaseOrders.length,
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      id: 'team',
      label: 'Team & Floor Ops',
      sublabel: 'Staff Profiles & Drivers',
      icon: Users,
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 border-r border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-3 sm:p-4 flex flex-col gap-1 transition-colors duration-200">
      <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
        Navigation Modules
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{item.label}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    {item.sublabel}
                  </p>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-full shrink-0 ${
                    item.badgeColor || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Warehouse Status Pill at bottom */}
      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-750">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Bhiwandi Dock Gate #2</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Loading bay active. Next transporter: <strong className="text-slate-700 dark:text-slate-300">V-Trans (MH-04)</strong>
          </p>
        </div>
      </div>
    </aside>
  );
};


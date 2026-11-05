'use client';

import React, { useState, useEffect } from 'react';
import { useApp, TabType } from '@/context/AppContext';
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  ClipboardCheck,
  Truck,
  FileInput,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, orders, products, purchaseOrders } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Read saved collapse state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('helios_sidebar_collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('helios_sidebar_collapsed', String(next));
      return next;
    });
  };

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
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'inventory',
      label: 'Solar Inventory',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount}` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
    },
    {
      id: 'sales',
      label: 'Sales & Orders',
      icon: ShoppingCart,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300',
    },
    {
      id: 'checklist',
      label: 'Pre-Dispatch Checklist',
      icon: ClipboardCheck,
      badge: readyForInspectionCount > 0 ? `${readyForInspectionCount}` : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-semibold',
    },
    {
      id: 'tracking',
      label: 'Order Tracking & Fleet',
      icon: Truck,
    },
    {
      id: 'purchase',
      label: 'Purchase Orders',
      icon: FileInput,
      badge: purchaseOrders.length > 0 ? purchaseOrders.length : undefined,
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      id: 'team',
      label: 'Team & Floor Ops',
      icon: Users,
    },
  ];

  return (
    <aside
      className={`shrink-0 border-r border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-2 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-[68px]' : 'w-full lg:w-60'
      }`}
    >
      {/* Sidebar Header with Collapse / Expand Trigger */}
      <div
        className={`flex items-center pb-2 mb-1 border-b border-slate-100 dark:border-slate-800/80 ${
          isCollapsed ? 'justify-center' : 'justify-between px-2'
        }`}
      >
        {!isCollapsed && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </span>
        )}
        <button
          onClick={toggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand Sidebar (Ctrl+B)' : 'Collapse to Icons'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-amber-500" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? `${item.label} ${item.badge ? `(${item.badge})` : ''}` : undefined}
              className={`group relative flex items-center rounded-xl text-left transition-all duration-150 ${
                isCollapsed
                  ? 'justify-center p-2.5'
                  : 'justify-between px-3 py-2 text-xs'
              } ${
                isActive
                  ? 'bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-white font-semibold shadow-xs before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-amber-500'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-amber-500 dark:text-amber-400 stroke-[2.2]'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-amber-500 dark:group-hover:text-amber-400'
                  }`}
                />

                {!isCollapsed && (
                  <span className="truncate tracking-tight font-medium">
                    {item.label}
                  </span>
                )}
              </div>

              {/* Badge */}
              {item.badge && (
                <>
                  {!isCollapsed ? (
                    <span
                      className={`ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full shrink-0 ${
                        item.badgeColor || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Warehouse Status Dock Footer */}
      <div className="pt-2 mt-auto border-t border-slate-100 dark:border-slate-800/80">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-750">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="truncate">Dock Gate #2 Active</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              Next: V-Trans (MH-04)
            </p>
          </div>
        ) : (
          <div
            className="flex justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-750 cursor-pointer"
            title="Bhiwandi Dock Gate #2 Active • Transporter: V-Trans"
            onClick={toggleCollapse}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        )}
      </div>
    </aside>
  );
};

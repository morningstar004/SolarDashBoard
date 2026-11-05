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
      badgeColor: 'bg-[#FEF6E6] text-[#A6680C] dark:bg-[#2D2115] dark:text-[#FCD34D]',
    },
    {
      id: 'sales',
      label: 'Sales & Orders',
      icon: ShoppingCart,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      badgeColor: 'bg-[#EEF4FF] text-[#2E5AAC] dark:bg-[#1E2638] dark:text-[#93B4F5]',
    },
    {
      id: 'checklist',
      label: 'Pre-Dispatch Checklist',
      icon: ClipboardCheck,
      badge: readyForInspectionCount > 0 ? `${readyForInspectionCount}` : undefined,
      badgeColor: 'bg-[#E8F8F0] text-[#168051] dark:bg-[#1A2D22] dark:text-[#78E0A9] font-bold',
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
      badgeColor: 'bg-[#F4F0E8] text-[#5C5247] dark:bg-[#2A221C] dark:text-[#D4CCC0]',
    },
    {
      id: 'team',
      label: 'Team & Floor Ops',
      icon: Users,
    },
  ];

  return (
    <aside
      className={`shrink-0 border-r border-[#EBE7DF] dark:border-[#2D2520] bg-white/90 dark:bg-[#1A1512]/90 backdrop-blur-md p-2 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-[68px]' : 'w-full lg:w-60'
      }`}
    >
      {/* Sidebar Header with Collapse / Expand Trigger */}
      <div
        className={`flex items-center pb-2 mb-1 border-b border-[#F0EBE1] dark:border-[#2D2520] ${
          isCollapsed ? 'justify-center' : 'justify-between px-2'
        }`}
      >
        {!isCollapsed && (
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8F867C]">
            Navigation
          </span>
        )}
        <button
          onClick={toggleCollapse}
          className="p-1.5 rounded-lg text-[#8F867C] hover:text-[#1C1613] dark:hover:text-[#FAF7F2] hover:bg-[#F4F0E8] dark:hover:bg-[#28211B] transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse to Icons'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-[#A87208] dark:text-[#FCD34D]" />
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
                  ? 'bg-[#F4F0E8] dark:bg-[#2A221C] text-[#1C1613] dark:text-[#FAF7F2] font-bold shadow-xs before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-[#FCD34D]'
                  : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613] dark:hover:text-[#FAF7F2] hover:bg-[#FAF7F2] dark:hover:bg-[#221B17]'
              }`}
            >
              <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#A87208] dark:text-[#FCD34D] stroke-[2.4]'
                      : 'text-[#8F867C] dark:text-[#80766B] group-hover:text-[#A87208] dark:group-hover:text-[#FCD34D]'
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
                        item.badgeColor || 'bg-[#F4F0E8] text-[#5C5247] dark:bg-[#2A221C] dark:text-[#D4CCC0]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FCD34D] ring-2 ring-white dark:ring-[#1A1512]" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Warehouse Status Dock Footer */}
      <div className="pt-2 mt-auto border-t border-[#F0EBE1] dark:border-[#2D2520]">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-[#FBF9F5] dark:bg-[#221B17] border border-[#EBE7DF] dark:border-[#2E251E]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1C1613] dark:text-[#F7F4EF]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="truncate">Dock Gate #2 Active</span>
            </div>
            <p className="text-[10px] text-[#7D756D] dark:text-[#A89F95] truncate mt-0.5">
              Next: V-Trans (MH-04)
            </p>
          </div>
        ) : (
          <div
            className="flex justify-center p-2 rounded-xl bg-[#FBF9F5] dark:bg-[#221B17] border border-[#EBE7DF] dark:border-[#2E251E] cursor-pointer"
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

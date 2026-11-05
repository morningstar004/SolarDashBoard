'use client';

import React, { useEffect } from 'react';
import { useApp, TabType } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardModule } from '@/components/dashboard/DashboardModule';
import { InventoryModule } from '@/components/inventory/InventoryModule';
import { SalesOrdersModule } from '@/components/sales/SalesOrdersModule';
import { PreDispatchChecklistModule } from '@/components/checklist/PreDispatchChecklistModule';
import { OrderTrackingModule } from '@/components/tracking/OrderTrackingModule';
import { PurchaseOrdersModule } from '@/components/purchase/PurchaseOrdersModule';
import { TeamModule } from '@/components/team/TeamModule';

export const AppShell: React.FC<{ defaultTab?: TabType }> = ({ defaultTab }) => {
  const { activeTab, setActiveTab } = useApp();

  useEffect(() => {
    if (defaultTab && defaultTab !== activeTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] dark:bg-[#120F0D] transition-colors duration-200">
      {/* Top Header */}
      <Navbar />

      {/* Main Container - Full Screen Width */}
      <div className="flex-1 flex flex-col lg:flex-row w-full">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto w-full">
          {activeTab === 'dashboard' && <DashboardModule />}
          {activeTab === 'inventory' && <InventoryModule />}
          {activeTab === 'sales' && <SalesOrdersModule />}
          {activeTab === 'checklist' && <PreDispatchChecklistModule />}
          {activeTab === 'tracking' && <OrderTrackingModule />}
          {activeTab === 'purchase' && <PurchaseOrdersModule />}
          {activeTab === 'team' && <TeamModule />}
        </main>
      </div>
    </div>
  );
};

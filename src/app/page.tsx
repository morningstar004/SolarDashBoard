'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardModule } from '@/components/dashboard/DashboardModule';
import { InventoryModule } from '@/components/inventory/InventoryModule';
import { SalesOrdersModule } from '@/components/sales/SalesOrdersModule';
import { PreDispatchChecklistModule } from '@/components/checklist/PreDispatchChecklistModule';
import { OrderTrackingModule } from '@/components/tracking/OrderTrackingModule';
import { PurchaseOrdersModule } from '@/components/purchase/PurchaseOrdersModule';
import { TeamModule } from '@/components/team/TeamModule';

export default function Home() {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 dark:bg-slate-950 transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
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
}

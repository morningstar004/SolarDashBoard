'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Moon,
  AlertTriangle,
  Search,
  MapPin,
  Clock,
  X,
  Package,
  ShoppingCart,
  FileInput,
  ArrowRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    products,
    orders,
    purchaseOrders,
    setActiveTab,
    setSelectedOrderIdForChecklist,
    setSelectedOrderIdForTracking,
  } = useApp();
  const [timeStr, setTimeStr] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' IST'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close search dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setShowMobileSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const lowStockCount = products.filter((p) => p.status === 'Low Stock' || p.status === 'Out of Stock').length;

  // Filtered search results
  const matchingProducts = searchTerm.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 3)
    : [];

  const matchingOrders = searchTerm.trim()
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (o.customer.gstin && o.customer.gstin.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 3)
    : [];

  const matchingPOs = searchTerm.trim()
    ? purchaseOrders.filter(
        (po) =>
          po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          po.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          po.supplierCity.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 2)
    : [];

  const totalResults = matchingProducts.length + matchingOrders.length + matchingPOs.length;

  const handleSelectProduct = () => {
    setActiveTab('inventory');
    setIsSearchOpen(false);
    setShowMobileSearch(false);
    setSearchTerm('');
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderIdForTracking(orderId);
    setSelectedOrderIdForChecklist(orderId);
    setActiveTab('sales');
    setIsSearchOpen(false);
    setShowMobileSearch(false);
    setSearchTerm('');
  };

  const handleSelectPO = () => {
    setActiveTab('purchase');
    setIsSearchOpen(false);
    setShowMobileSearch(false);
    setSearchTerm('');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EBE7DF] dark:border-[#2D2520] bg-white/95 dark:bg-[#1A1512]/95 backdrop-blur-md transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Depot Location */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FCD34D] text-[#1C1613] shadow-sm group cursor-pointer transition-transform hover:scale-105"
            title="HeliosOps Command Hub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 group-hover-spin-once hover-spin-once"
            >
              <path d="M 11 0 L 11 3 L 13 3 L 13 0 L 11 0 z M 4.2070312 2.7929688 L 2.7929688 4.2070312 L 4.8925781 6.3066406 L 6.3066406 4.8925781 L 4.2070312 2.7929688 z M 19.792969 2.7929688 L 17.693359 4.8925781 L 19.107422 6.3066406 L 21.207031 4.2070312 L 19.792969 2.7929688 z M 12 5 C 8.1545455 5 5 8.1545455 5 12 C 5 15.845455 8.1545455 19 12 19 C 15.845455 19 19 15.845455 19 12 C 19 8.1545455 15.845455 5 12 5 z M 12 7 C 14.754545 7 17 9.2454545 17 12 C 17 14.754545 14.754545 17 12 17 C 9.2454545 17 7 14.754545 7 12 C 7 9.2454545 9.2454545 7 12 7 z M 0 11 L 0 13 L 3 13 L 3 11 L 0 11 z M 21 11 L 21 13 L 24 13 L 24 11 L 21 11 z M 4.8925781 17.693359 L 2.7929688 19.792969 L 4.2070312 21.207031 L 6.3066406 19.107422 L 4.8925781 17.693359 z M 19.107422 17.693359 L 17.693359 19.107422 L 19.792969 21.207031 L 21.207031 19.792969 L 19.107422 17.693359 z M 11 21 L 11 24 L 13 24 L 13 21 L 11 21 z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                onClick={() => setActiveTab('dashboard')}
                className="text-lg font-black tracking-tight text-[#1C1613] dark:text-[#F7F4EF] cursor-pointer"
              >
                Helios<span className="text-[#C28E00] dark:text-[#FCD34D]">Ops</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#7D756D] dark:text-[#A89F95]">
              <span className="inline-flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-[#A87208] dark:text-[#FCD34D]" />
                <span className="hidden sm:inline">Bhiwandi Central Depot</span> (MH)
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px]">
                <Clock className="w-3 h-3" />
                {timeStr || 'IST'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Input with Live Results Popover (Desktop) */}
        <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F867C]" />
            <input
              type="text"
              value={searchTerm}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearchOpen(true);
              }}
              placeholder="Search solar panels, inverters, SO-9102, POs, GSTIN..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-[#E8E3DA] dark:border-[#352B24] bg-[#FBF9F5] dark:bg-[#221B17] text-[#1C1613] dark:text-[#F7F4EF] placeholder-[#8F867C] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]/40 focus:border-[#FCD34D] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#8F867C] hover:text-[#1C1613] dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Search Results Dropdown */}
          {isSearchOpen && searchTerm.trim() && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#1A1512] rounded-2xl shadow-xl dark:border dark:border-[#2D2520] p-3 space-y-3 z-50 animate-in fade-in slide-in-from-top-1 max-h-96 overflow-y-auto">
              {totalResults === 0 ? (
                <div className="text-center py-6 text-xs text-[#8F867C]">
                  No matching equipment, orders, or POs found for &quot;{searchTerm}&quot;.
                </div>
              ) : (
                <>
                  {/* Matching Sales Orders */}
                  {matchingOrders.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-[#8F867C] px-2 flex items-center gap-1.5">
                        <ShoppingCart className="w-3 h-3 text-[#A87208] dark:text-[#FCD34D]" />
                        <span>Sales Orders ({matchingOrders.length})</span>
                      </span>
                      {matchingOrders.map((ord) => (
                        <div
                          key={ord.id}
                          onClick={() => handleSelectOrder(ord.id)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F4F0E8] dark:hover:bg-[#241E19] cursor-pointer transition-colors text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-[#1C1613] dark:text-white">
                              {ord.id}
                            </span>
                            <span className="text-[#8F867C] ml-2 font-medium">
                              {ord.customer.company}
                            </span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FEF6E6] text-[#A6680C] dark:bg-[#2D2115] dark:text-[#FCD34D] font-bold">
                            {ord.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matching Products */}
                  {matchingProducts.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-[#8F867C] px-2 flex items-center gap-1.5">
                        <Package className="w-3 h-3 text-[#168051] dark:text-[#78E0A9]" />
                        <span>Inventory Items ({matchingProducts.length})</span>
                      </span>
                      {matchingProducts.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={handleSelectProduct}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F4F0E8] dark:hover:bg-[#241E19] cursor-pointer transition-colors text-xs"
                        >
                          <div>
                            <span className="font-bold text-[#1C1613] dark:text-white">
                              {prod.brand} {prod.name}
                            </span>
                            <span className="text-[10px] text-[#8F867C] block">
                              {prod.category} • In Stock: {prod.inStock} units
                            </span>
                          </div>
                          <span className="font-mono font-bold text-[#1C1613] dark:text-white">
                            ₹{prod.sellingPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matching Purchase Orders */}
                  {matchingPOs.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-[#8F867C] px-2 flex items-center gap-1.5">
                        <FileInput className="w-3 h-3 text-[#2E5AAC] dark:text-[#93B4F5]" />
                        <span>Purchase Orders ({matchingPOs.length})</span>
                      </span>
                      {matchingPOs.map((po) => (
                        <div
                          key={po.id}
                          onClick={handleSelectPO}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F4F0E8] dark:hover:bg-[#241E19] cursor-pointer transition-colors text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-[#1C1613] dark:text-white">
                              {po.id}
                            </span>
                            <span className="text-[#8F867C] ml-2 font-medium">
                              {po.supplierName} ({po.supplierCity})
                            </span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF4FF] text-[#2E5AAC] dark:bg-[#1E2638] dark:text-[#93B4F5] font-bold">
                            {po.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Search Toggle (Mobile), Low Stock Alert, Theme Toggle & User Profile */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 rounded-xl text-[#5C5247] dark:text-[#D4CCC0] bg-[#FBF9F5] dark:bg-[#221B17] hover:bg-[#F4F0E8] dark:hover:bg-[#2C231E] border border-[#E8E3DA] dark:border-[#352B24] transition-all"
            title="Search"
            aria-label="Toggle mobile search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Low Stock Badge */}
          {lowStockCount > 0 && (
            <button
              onClick={() => setActiveTab('inventory')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 transition-colors shadow-xs"
              title="Click to view low stock items"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-pulse" />
              <span className="hidden sm:inline">Low Stock</span>
              <span className="px-1.5 py-0.2 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 text-[10px]">
                {lowStockCount}
              </span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="group p-2 rounded-xl text-[#5C5247] dark:text-[#D4CCC0] bg-[#FBF9F5] dark:bg-[#221B17] hover:bg-[#F4F0E8] dark:hover:bg-[#2C231E] border border-[#E8E3DA] dark:border-[#352B24] transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-[#FCD34D] group-hover-spin-once hover-spin-once"
              >
                <path d="M 11 0 L 11 3 L 13 3 L 13 0 L 11 0 z M 4.2070312 2.7929688 L 2.7929688 4.2070312 L 4.8925781 6.3066406 L 6.3066406 4.8925781 L 4.2070312 2.7929688 z M 19.792969 2.7929688 L 17.693359 4.8925781 L 19.107422 6.3066406 L 21.207031 4.2070312 L 19.792969 2.7929688 z M 12 5 C 8.1545455 5 5 8.1545455 5 12 C 5 15.845455 8.1545455 19 12 19 C 15.845455 19 19 15.845455 19 12 C 19 8.1545455 15.845455 5 12 5 z M 12 7 C 14.754545 7 17 9.2454545 17 12 C 17 14.754545 14.754545 17 12 17 C 9.2454545 17 7 14.754545 7 12 C 7 9.2454545 9.2454545 7 12 7 z M 0 11 L 0 13 L 3 13 L 3 11 L 0 11 z M 21 11 L 21 13 L 24 13 L 24 11 L 21 11 z M 4.8925781 17.693359 L 2.7929688 19.792969 L 4.2070312 21.207031 L 6.3066406 19.107422 L 4.8925781 17.693359 z M 19.107422 17.693359 L 17.693359 19.107422 L 19.792969 21.207031 L 21.207031 19.792969 L 19.107422 17.693359 z M 11 21 L 11 24 L 13 24 L 13 21 L 11 21 z" />
              </svg>
            ) : (
              <Moon className="w-4 h-4 text-[#1C1613] transition-transform duration-300 group-hover:-rotate-12" />
            )}
          </button>

          {/* User Profile Chip */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2.5 border-l border-[#EBE7DF] dark:border-[#2D2520]">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#FCD34D] shadow-xs shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                alt="Rajesh Sharma"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left text-xs leading-tight">
              <p className="font-bold text-[#1C1613] dark:text-[#F7F4EF]">Rajesh Sharma</p>
              <p className="text-[10px] text-[#7D756D] dark:text-[#A89F95] font-medium">Operations Head</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Input Drawer (Visible when toggled on mobile) */}
      {showMobileSearch && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-[#F0EBE1] dark:border-[#2D2520] bg-white dark:bg-[#1A1512]">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8F867C]" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search equipment, SO-9102, POs..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-[#E8E3DA] dark:border-[#352B24] bg-[#FBF9F5] dark:bg-[#221B17] text-[#1C1613] dark:text-[#F7F4EF] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#8F867C]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {searchTerm.trim() && totalResults > 0 && (
            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto pt-1">
              {matchingOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => handleSelectOrder(ord.id)}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] text-xs"
                >
                  <span className="font-bold text-[#1C1613] dark:text-white">
                    {ord.id} — {ord.customer.company}
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#A87208] dark:text-[#FCD34D]" />
                </div>
              ))}
              {matchingProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={handleSelectProduct}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] text-xs"
                >
                  <span className="font-bold text-[#1C1613] dark:text-white">
                    {prod.brand} {prod.name}
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#168051] dark:text-[#78E0A9]" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
};


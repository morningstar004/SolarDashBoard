'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Sun,
  Moon,
  AlertTriangle,
  Search,
  MapPin,
  Clock,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, products, setActiveTab } = useApp();
  const [timeStr, setTimeStr] = useState<string>('');

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

  const lowStockCount = products.filter((p) => p.status === 'Low Stock' || p.status === 'Out of Stock').length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EBE7DF] dark:border-[#2D2520] bg-white/95 dark:bg-[#1A1512]/95 backdrop-blur-md transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Depot Location */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FCD34D] text-[#1C1613] shadow-sm">
            <Sun className="w-6 h-6 stroke-[2.4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-[#1C1613] dark:text-[#F7F4EF]">
                Helios<span className="text-[#C28E00] dark:text-[#FCD34D]">Ops</span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F4F0E8] text-[#5C5247] dark:bg-[#28211B] dark:text-[#EAE3D8] border border-[#E5DFD4] dark:border-[#3A3027]">
                India Distribution Hub
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#7D756D] dark:text-[#A89F95]">
              <span className="inline-flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-[#A87208] dark:text-[#FCD34D]" />
                Bhiwandi Central Depot (MH)
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                <Clock className="w-3 h-3" />
                {timeStr || 'Loading IST...'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Input */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F867C]" />
            <input
              type="text"
              placeholder="Search solar panels, inverters, SO-9102, POs, GSTIN..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E8E3DA] dark:border-[#352B24] bg-[#FBF9F5] dark:bg-[#221B17] text-[#1C1613] dark:text-[#F7F4EF] placeholder-[#8F867C] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]/40 focus:border-[#FCD34D] transition-all"
            />
          </div>
        </div>

        {/* Right: Low Stock Alert, Theme Toggle & User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Low Stock Badge */}
          {lowStockCount > 0 && (
            <button
              onClick={() => setActiveTab('inventory')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FEF6E6] hover:bg-[#FDEFC4] dark:bg-[#2D2115] dark:hover:bg-[#3B2B1B] text-[#A6680C] dark:text-[#FCD34D] border border-[#FDE3B2] dark:border-[#4B3722] transition-colors"
              title="Click to view low stock items"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#D99814] dark:text-[#FCD34D] animate-pulse" />
              <span>{lowStockCount} Low Stock</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#5C5247] dark:text-[#D4CCC0] bg-[#FBF9F5] dark:bg-[#221B17] hover:bg-[#F4F0E8] dark:hover:bg-[#2C231E] border border-[#E8E3DA] dark:border-[#352B24] transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FCD34D]" />
            ) : (
              <Moon className="w-4 h-4 text-[#1C1613]" />
            )}
          </button>

          {/* User Profile Chip */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2.5 border-l border-[#EBE7DF] dark:border-[#2D2520]">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#FCD34D] shadow-xs">
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
    </header>
  );
};

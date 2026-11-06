'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Employee, NonPermanentContractor, WorkloadStatus } from '@/types';
import {
  Users,
  Grid,
  Network,
  Clock,
  Phone,
  Mail,
  Award,
  IndianRupee,
  Calendar,
  Star,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Truck,
  Wrench,
  X,
  ChevronRight,
  ExternalLink,
  Plus,
  Layers,
  Briefcase,
  Sparkles,
  GitBranch,
} from 'lucide-react';

export const TeamModule: React.FC = () => {
  const {
    employees,
    contractors,
    orders,
    updateEmployeeStatus,
    bookContractor,
    assignOrder,
    addToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'simple' | 'hierarchical'>('simple');
  const [selectedEmployeeForModal, setSelectedEmployeeForModal] = useState<Employee | null>(null);
  const [bookingContractor, setBookingContractor] = useState<NonPermanentContractor | null>(null);
  const [bookingProjectNote, setBookingProjectNote] = useState('SO-9102 Solar Farm Dispatch Staging');

  // Order assignment modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignOrderId, setAssignOrderId] = useState(orders[0]?.id || 'SO-9102');
  const [assignTrader, setAssignTrader] = useState('Suresh Nair');
  const [assignInspector, setAssignInspector] = useState('Priya Patel');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingContractor) return;
    bookContractor(bookingContractor.id, bookingProjectNote);
    setBookingContractor(null);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    assignOrder(assignOrderId, assignTrader, assignInspector);
    setShowAssignModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)]">
        <div>
          <h2 className="text-base font-black text-[#1C1613] dark:text-[#F7F4EF] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#A87208] dark:text-[#FCD34D]" />
            <span>Team Management & Floor Operations Roster</span>
          </h2>
          <p className="text-xs text-[#7D756D] dark:text-[#A89F95] mt-0.5">
            Internal warehouse team, duty check-in logs, and on-demand certified solar drivers & contractors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-[#F4F0E8] dark:bg-[#241E19] dark:border dark:border-[#352B24]">
            <button
              onClick={() => setViewMode('simple')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'simple'
                  ? 'bg-[#1C1613] dark:bg-[#FCD34D] text-white dark:text-[#1C1613] shadow-xs'
                  : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Simple Cards View</span>
            </button>

            <button
              onClick={() => setViewMode('hierarchical')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'hierarchical'
                  ? 'bg-[#1C1613] dark:bg-[#FCD34D] text-white dark:text-[#1C1613] shadow-xs'
                  : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613]'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Hierarchical Org View</span>
            </button>
          </div>

          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#FCD34D] hover:bg-[#fbbf24] text-[#1C1613] shadow-md shadow-[#FCD34D]/20 transition-all"
          >
            <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Reassign Orders</span>
          </button>
        </div>
      </div>

      {/* 1. SIMPLE CARDS VIEW */}
      {viewMode === 'simple' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => {
            const statusColor =
              emp.status === 'Active on Dock'
                ? 'bg-[#E8F8F0] text-[#168051] border-[#C6EED8] dark:bg-[#1A2D22] dark:text-[#78E0A9]'
                : emp.status === 'Reviewing POs'
                ? 'bg-[#EEF4FF] text-[#2E5AAC] border-[#CCDDFE] dark:bg-[#1E2638] dark:text-[#93B4F5]'
                : emp.status === 'On Break'
                ? 'bg-[#FEF6E6] text-[#A6680C] border-[#FDE3B2] dark:bg-[#2D2115] dark:text-[#FCD34D]'
                : 'bg-[#F4F0E8] text-[#5C5247] border-[#E5DFD4] dark:bg-[#2A221C] dark:text-[#D4CCC0]';

            return (
              <div
                key={emp.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-4 hover:shadow-[0_8px_24px_-4px_rgba(40,30,20,0.08)] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Avatar & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#FCD34D]/60 shrink-0">
                        <img
                          src={emp.avatarUrl}
                          alt={emp.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#1C1613] dark:text-white leading-tight">
                          {emp.name}
                        </h3>
                        <p className="text-xs text-[#A87208] dark:text-[#FCD34D] font-semibold">
                          {emp.role}
                        </p>
                        <p className="text-[10px] text-[#8F867C]">{emp.department}</p>
                      </div>
                    </div>

                    <select
                      value={emp.status}
                      onChange={(e) => updateEmployeeStatus(emp.id, e.target.value as WorkloadStatus)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border cursor-pointer outline-none ${statusColor}`}
                    >
                      <option value="Active on Dock">Active on Dock</option>
                      <option value="Reviewing POs">Reviewing POs</option>
                      <option value="On Break">On Break</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>

                  {/* Current Work & Check-in Time */}
                  <div className="mt-4 p-3 rounded-2xl bg-[#FBF9F5] dark:bg-[#201A16] dark:border dark:border-[#2D2520] text-xs space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8F867C] flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-[#A87208] dark:text-[#FCD34D]" />
                        Today Check-in:
                      </span>
                      <span className="font-semibold text-[#1C1613] dark:text-[#FAF7F2]">
                        {emp.checkInTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#8F867C] text-[11px]">Shift:</span>
                      <span className="text-[#5C5247] dark:text-[#D4CCC0] text-[11px] font-mono">
                        {emp.shift.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#8F867C] text-[11px]">Active Orders Assigned:</span>
                      <span className="font-bold text-[#1C1613] dark:text-white">
                        {emp.activeOrdersCount} orders
                      </span>
                    </div>
                  </div>

                  {/* Certifications badges */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {emp.certifications.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[#F4F0E8] dark:bg-[#241E19] text-[#5C5247] dark:text-[#D4CCC0] border border-[#E8E3DA] dark:border-[#352B24]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Actions: Extend / Manage Employee */}
                <div className="pt-3 border-t border-[#EBE7DF]/60 dark:border-[#2D2520] flex items-center justify-between">
                  <div className="text-[11px] text-[#8F867C]">
                    Rating: <strong className="text-[#A87208] dark:text-[#FCD34D]">{emp.rating} ★</strong>
                  </div>

                  <button
                    onClick={() => setSelectedEmployeeForModal(emp)}
                    className="flex items-center gap-1 text-xs font-bold text-[#A87208] dark:text-[#FCD34D] hover:text-[#8C5D04] transition-colors"
                  >
                    <span>Extend & Manage</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. HIERARCHICAL ORG VIEW */}
      {viewMode === 'hierarchical' && (() => {
        const executiveHead = employees.find((e) => e.id === 'emp-101') || employees[0];
        const qcLead = employees.find((e) => e.id === 'emp-102') || employees.find((e) => e.department === 'Quality Control');
        const dispatchLead = employees.find((e) => e.id === 'emp-103') || employees.find((e) => e.department === 'Logistics & Dispatch');
        const tradingLead = employees.find((e) => e.id === 'emp-104') || employees.find((e) => e.department === 'Solar Trading & Sales');
        const dockPacker = employees.find((e) => e.id === 'emp-105');
        const procurementSpecialist = employees.find((e) => e.id === 'emp-106') || employees.find((e) => e.department === 'Procurement');
        const inventoryAuditor = employees.find((e) => e.id === 'emp-107');

        const renderClayNode = (
          emp: Employee,
          levelTag: string,
          colorTheme: 'gold' | 'blue' | 'emerald' | 'amber',
          subtitleOverride?: string,
          subordinateBadge?: string
        ) => {
          const statusBg =
            emp.status === 'Active on Dock'
              ? 'bg-[#E8F8F0] text-[#168051] dark:bg-[#1A2D22] dark:text-[#78E0A9]'
              : emp.status === 'Reviewing POs'
              ? 'bg-[#EEF4FF] text-[#2E5AAC] dark:bg-[#1E2638] dark:text-[#93B4F5]'
              : emp.status === 'On Break'
              ? 'bg-[#FEF6E6] text-[#A6680C] dark:bg-[#2D2115] dark:text-[#FCD34D]'
              : 'bg-[#F4F0E8] text-[#5C5247] dark:bg-[#2A221C] dark:text-[#D4CCC0]';

          const themeRing =
            colorTheme === 'gold'
              ? 'ring-[#FCD34D]'
              : colorTheme === 'blue'
              ? 'ring-[#2E5AAC]/40 dark:ring-[#93B4F5]/40'
              : colorTheme === 'emerald'
              ? 'ring-[#168051]/40 dark:ring-[#78E0A9]/40'
              : 'ring-[#A87208]/40 dark:ring-[#FCD34D]/40';

          const themePillBg =
            colorTheme === 'gold'
              ? 'bg-[#FEF6E6] text-[#A87208] dark:bg-[#2D2115] dark:text-[#FCD34D]'
              : colorTheme === 'blue'
              ? 'bg-[#EEF4FF] text-[#2E5AAC] dark:bg-[#1E2638] dark:text-[#93B4F5]'
              : colorTheme === 'emerald'
              ? 'bg-[#E8F8F0] text-[#168051] dark:bg-[#1A2D22] dark:text-[#78E0A9]'
              : 'bg-[#FEF6E6] text-[#A87208] dark:bg-[#2D2115] dark:text-[#FCD34D]';

          return (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployeeForModal(emp)}
              className="group relative p-4.5 rounded-2xl bg-gradient-to-br from-[#FFFFFF] via-[#FAF8F5] to-[#F3EDE2] dark:from-[#241D17] dark:via-[#1D1612] dark:to-[#17120E] shadow-[0_8px_20px_-3px_rgba(180,165,145,0.22),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(215,200,180,0.15)] dark:shadow-[0_8px_20px_-3px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.06),inset_0_-1px_2px_rgba(0,0,0,0.4)] dark:border dark:border-[#2D2520] hover:-translate-y-1 hover:shadow-[0_14px_30px_-4px_rgba(180,165,145,0.32)] dark:hover:shadow-[0_14px_30px_-4px_rgba(0,0,0,0.7)] transition-all duration-200 cursor-pointer space-y-3.5"
            >
              {/* Top Tag & Status Dropdown */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${themePillBg} shadow-2xs`}>
                    {levelTag}
                  </span>
                  {subordinateBadge && (
                    <span className="text-[9px] font-bold text-[#8F867C] dark:text-[#A89F95]">
                      {subordinateBadge}
                    </span>
                  )}
                </div>

                <select
                  value={emp.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateEmployeeStatus(emp.id, e.target.value as WorkloadStatus)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer transition-all ${statusBg} shadow-2xs`}
                >
                  <option value="Active on Dock">● Active on Dock</option>
                  <option value="Reviewing POs">● Reviewing POs</option>
                  <option value="On Break">● On Break</option>
                  <option value="Offline">● Offline</option>
                </select>
              </div>

              {/* Profile Details */}
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <div className={`w-11 h-11 rounded-2xl overflow-hidden ring-2 ${themeRing} shadow-md`}>
                    <img src={emp.avatarUrl} alt={emp.name} className="w-full h-full object-cover" />
                  </div>
                  {emp.status === 'Active on Dock' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 ring-2 ring-white dark:ring-[#1C1613] rounded-full flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-black text-[#1C1613] dark:text-white truncate group-hover:text-[#A87208] dark:group-hover:text-[#FCD34D] transition-colors">
                    {emp.name}
                  </h4>
                  <p className="text-xs font-bold text-[#A87208] dark:text-[#FCD34D] line-clamp-1">
                    {emp.role}
                  </p>
                  <p className="text-[10px] text-[#8F867C] dark:text-[#A89F95] mt-0.5">
                    {subtitleOverride || emp.department}
                  </p>
                </div>
              </div>

              {/* Shift & Duty Check-in */}
              <div className="p-2.5 rounded-xl bg-[#F6F1E7]/70 dark:bg-[#201813]/70 text-[11px] space-y-1 shadow-2xs">
                <div className="flex items-center justify-between text-[#6E6459] dark:text-[#B5ABA0]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#A87208] dark:text-[#FCD34D]" />
                    <span className="font-medium text-[10px]">{emp.shift.split(' ')[0]} Shift</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#1C1613] dark:text-[#F7F4EF]">
                    {emp.checkInTime}
                  </span>
                </div>
              </div>

              {/* Workload & Rating Chips */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-white/80 dark:bg-[#1A1410]/80 shadow-2xs text-center">
                  <span className="text-[9px] uppercase font-bold text-[#8F867C] dark:text-[#8E867E] block">
                    Assigned SOs
                  </span>
                  <span className="font-black text-[#1C1613] dark:text-white text-xs">
                    {emp.activeOrdersCount} Orders
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/80 dark:bg-[#1A1410]/80 shadow-2xs text-center">
                  <span className="text-[9px] uppercase font-bold text-[#8F867C] dark:text-[#8E867E] block">
                    Performance
                  </span>
                  <span className="font-black text-[#A87208] dark:text-[#FCD34D] text-xs">
                    {emp.rating} ★ <span className="text-[10px] text-[#8F867C]">({emp.tenureMonths}m)</span>
                  </span>
                </div>
              </div>

              {/* Certifications Pills */}
              <div className="flex flex-wrap gap-1">
                {emp.certifications.slice(0, 2).map((cert, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-[#EFE9DD] dark:bg-[#28201A] text-[#5C5247] dark:text-[#D4CCC0] shadow-2xs truncate max-w-[180px]"
                  >
                    {cert}
                  </span>
                ))}
                {emp.certifications.length > 2 && (
                  <span className="px-1.5 py-0.5 rounded-lg text-[9px] font-bold bg-[#EFE9DD] dark:bg-[#28201A] text-[#8F867C] dark:text-[#A89F95]">
                    +{emp.certifications.length - 2}
                  </span>
                )}
              </div>

              {/* Footer Hint */}
              <div className="pt-2 border-t border-[#EAE3D4]/80 dark:border-[#2D2520] flex items-center justify-between text-xs">
                <span className="text-[10px] font-medium text-[#8F867C] dark:text-[#A89F95]">
                  ₹{emp.monthlyPayoutINR.toLocaleString('en-IN')}/mo • {emp.leavesBalance}d Leave
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#A87208] dark:text-[#FCD34D] group-hover:underline">
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          );
        };

        return (
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-8">
            {/* Header & Interactive Wireframe Legend */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#EBE7DF]/60 dark:border-[#2D2520]">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-2xl bg-[#FEF6E6] dark:bg-[#2D2115] text-[#A87208] dark:text-[#FCD34D] shadow-2xs">
                    <GitBranch className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#1C1613] dark:text-white">
                      Solar Warehouse Supervisory & Delegation Hierarchy
                    </h3>
                    <p className="text-xs text-[#7D756D] dark:text-[#A89F95] mt-0.5">
                      Visual operational wireframe mapping executive command, division leads, and active floor operatives.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                <span className="px-2.5 py-1 rounded-xl bg-[#FEF6E6] text-[#A87208] dark:bg-[#2D2115] dark:text-[#FCD34D] shadow-2xs">
                  👑 Level 1: Command
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#EEF4FF] text-[#2E5AAC] dark:bg-[#1E2638] dark:text-[#93B4F5] shadow-2xs">
                  🛡️ Level 2: Leads
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#E8F8F0] text-[#168051] dark:bg-[#1A2D22] dark:text-[#78E0A9] shadow-2xs">
                  ⚡ Level 3: Operatives
                </span>
              </div>
            </div>

            {/* Top Level 1: Operations Leadership (Hero Clay Card) */}
            <div className="max-w-xl mx-auto">
              <div
                onClick={() => setSelectedEmployeeForModal(executiveHead)}
                className="group relative p-6 rounded-3xl bg-gradient-to-br from-[#FFFDF8] via-[#FAF6ED] to-[#F2EADB] dark:from-[#251D17] dark:via-[#1F1712] dark:to-[#17120E] shadow-[0_12px_32px_-6px_rgba(180,150,110,0.25),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(200,180,150,0.2)] dark:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.65),inset_0_1px_2px_rgba(255,255,255,0.08)] dark:border dark:border-[#2D2520] hover:-translate-y-1 hover:shadow-[0_18px_40px_-6px_rgba(180,150,110,0.35)] dark:hover:shadow-[0_18px_40px_-6px_rgba(0,0,0,0.8)] transition-all duration-200 cursor-pointer space-y-4"
              >
                {/* Header Tag Strip */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-[#FCD34D] text-[#1C1613] shadow-xs flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 fill-[#1C1613]" />
                      <span>Level 1: Executive Operations Command</span>
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-bold text-[#8F867C] dark:text-[#A89F95]">
                      Overall Floor Head
                    </span>
                  </div>

                  <select
                    value={executiveHead.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateEmployeeStatus(executiveHead.id, e.target.value as WorkloadStatus)}
                    className="text-[10px] font-bold px-3 py-1 rounded-full border-0 outline-none cursor-pointer bg-[#E8F8F0] text-[#168051] dark:bg-[#1A2D22] dark:text-[#78E0A9] shadow-2xs"
                  >
                    <option value="Active on Dock">● Active on Dock</option>
                    <option value="Reviewing POs">● Reviewing POs</option>
                    <option value="On Break">● On Break</option>
                    <option value="Offline">● Offline</option>
                  </select>
                </div>

                {/* Profile Identity */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-[#FCD34D] shadow-lg shadow-[#FCD34D]/25">
                      <img
                        src={executiveHead.avatarUrl}
                        alt={executiveHead.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 ring-2 ring-white dark:ring-[#1C1613] rounded-full flex items-center justify-center">
                      <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-[#1C1613] dark:text-white group-hover:text-[#A87208] dark:group-hover:text-[#FCD34D] transition-colors">
                        {executiveHead.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-[#FEF6E6] text-[#A87208] dark:bg-[#2D2115] dark:text-[#FCD34D] shadow-2xs">
                        Command Lead
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#A87208] dark:text-[#FCD34D]">
                      {executiveHead.role}
                    </p>
                    <p className="text-[11px] text-[#7D756D] dark:text-[#A89F95] mt-0.5">
                      Warehouse Operations, Quality Compliance & Multi-Bay Dispatch Command
                    </p>
                  </div>
                </div>

                {/* Key Metrics Inset Grid */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-[#1A1410]/80 shadow-2xs">
                    <span className="text-[9px] uppercase font-bold text-[#8F867C] dark:text-[#8E867E] block">
                      Direct Supervision
                    </span>
                    <span className="font-black text-[#1C1613] dark:text-white text-xs sm:text-sm">
                      {executiveHead.activeOrdersCount} Supervised SOs
                    </span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-[#1A1410]/80 shadow-2xs">
                    <span className="text-[9px] uppercase font-bold text-[#8F867C] dark:text-[#8E867E] block">
                      Performance
                    </span>
                    <span className="font-black text-[#A87208] dark:text-[#FCD34D] text-xs sm:text-sm">
                      {executiveHead.rating} ★
                    </span>
                    <span className="text-[9px] text-[#8F867C] block">
                      {executiveHead.tenureMonths} Mos Tenure
                    </span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-[#1A1410]/80 shadow-2xs">
                    <span className="text-[9px] uppercase font-bold text-[#8F867C] dark:text-[#8E867E] block">
                      Duty Check-in
                    </span>
                    <span className="font-mono font-bold text-[#1C1613] dark:text-white text-xs">
                      {executiveHead.checkInTime}
                    </span>
                    <span className="text-[9px] text-[#8F867C] block">
                      General Shift
                    </span>
                  </div>
                </div>

                {/* Certifications & Action Footer */}
                <div className="pt-3 border-t border-[#EAE3D4]/80 dark:border-[#2D2520] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {executiveHead.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg text-[9px] font-bold bg-[#EFE9DD] dark:bg-[#28201A] text-[#5C5247] dark:text-[#D4CCC0] shadow-2xs"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>

                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#A87208] dark:text-[#FCD34D] group-hover:underline shrink-0">
                    <span>Inspect Executive Ledger</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Trunk Line & Branch Wireframe System */}
            <div className="flex flex-col items-center">
              <div className="w-1 h-7 bg-gradient-to-b from-[#FCD34D] to-[#D4A325] rounded-full" />
              <div className="relative flex items-center justify-center my-0.5 z-10">
                <div className="w-5 h-5 rounded-full bg-[#FCD34D] ring-4 ring-[#FEF6E6] dark:ring-[#2D2115] shadow-sm flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#1C1613]" />
                </div>
                <span className="hidden md:inline-flex items-center gap-1.5 absolute left-7 text-[10px] font-extrabold uppercase tracking-wider text-[#7D756D] dark:text-[#A89F95] bg-[#F4F0E8] dark:bg-[#251E19] px-2.5 py-0.5 rounded-full shadow-2xs whitespace-nowrap">
                  <Network className="w-3 h-3 text-[#A87208] dark:text-[#FCD34D]" />
                  <span>Delegation Busbar</span>
                </span>
              </div>
              <div className="w-1 h-4 bg-gradient-to-b from-[#D4A325] to-[#B88714] rounded-full" />
            </div>

            {/* Horizontal Busbar Rail (Desktop & Tablet) */}
            <div className="hidden md:block relative w-[80%] mx-auto h-7 -mt-2">
              <div className="h-1 w-full bg-gradient-to-r from-[#2E5AAC]/50 via-[#168051]/50 to-[#A87208]/50 rounded-full shadow-2xs" />

              {/* Pillar 1 Drop (QC) */}
              <div className="absolute top-0 left-[16.6%] -translate-x-1/2 flex flex-col items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#2E5AAC] ring-2 ring-white dark:ring-[#1A1512] -mt-1 shadow-xs" />
                <div className="w-0.5 h-6 bg-[#2E5AAC]/40 dark:bg-[#2E5AAC]/60" />
              </div>

              {/* Pillar 2 Drop (Warehouse Operations) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#168051] ring-2 ring-white dark:ring-[#1A1512] -mt-1 shadow-xs" />
                <div className="w-0.5 h-6 bg-[#168051]/40 dark:bg-[#168051]/60" />
              </div>

              {/* Pillar 3 Drop (Trading & Procurement) */}
              <div className="absolute top-0 right-[16.6%] translate-x-1/2 flex flex-col items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#A87208] ring-2 ring-white dark:ring-[#1A1512] -mt-1 shadow-xs" />
                <div className="w-0.5 h-6 bg-[#A87208]/40 dark:bg-[#A87208]/60" />
              </div>
            </div>

            {/* Departmental Branches (3 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
              {/* Pillar 1: Quality Control & High-Voltage Testing */}
              <div className="space-y-4">
                {/* Pillar Header Banner */}
                <div className="p-3.5 rounded-2xl bg-[#EEF4FF]/70 dark:bg-[#1E2638]/50 dark:border dark:border-[#2D2520] shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-[#2E5AAC] text-white shadow-2xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#2E5AAC] dark:text-[#93B4F5] uppercase tracking-wider">
                        Quality Control Division
                      </h4>
                      <p className="text-[10px] text-[#7D756D] dark:text-[#A89F95]">
                        High-Voltage & Hazmat LiFePO4
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#2E5AAC]/10 text-[#2E5AAC] dark:text-[#93B4F5]">
                    Pillar 1
                  </span>
                </div>

                {/* Lead Node: Priya Patel */}
                {qcLead && renderClayNode(qcLead, 'Level 2: QC Lead', 'blue', 'Quality Compliance & PV Testing')}

                {/* Downward Wire to Test Rig Station */}
                <div className="flex flex-col items-center py-1">
                  <div className="w-0.5 h-5 bg-[#2E5AAC]/40 dark:bg-[#2E5AAC]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2E5AAC] ring-2 ring-white dark:ring-[#1A1512] shadow-2xs" />
                  <div className="w-0.5 h-4 bg-[#2E5AAC]/40 dark:bg-[#2E5AAC]/60" />
                </div>

                {/* Testing Station Sub-Node */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-[#EEF4FF] dark:from-[#181E2C] dark:to-[#131722] dark:border dark:border-[#2D2520] shadow-[0_4px_16px_-2px_rgba(46,90,172,0.1)] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#2E5AAC] dark:text-[#93B4F5] flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Hi-Pot & EL Testing Bay</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E8F8F0] text-[#168051] dark:bg-[#1A2D22] dark:text-[#78E0A9]">
                      Station Calibrated
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                    Bay 2 Clean Room • 4 Modules Under Active Quality Hold
                  </p>
                  <div className="pt-2 border-t border-[#CCDDFE]/80 dark:border-[#2A3752] flex items-center justify-between text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                    <span>Standard: IEC 61215 PV</span>
                    <span className="font-semibold text-[#2E5AAC] dark:text-[#93B4F5]">Direct Sign-Off</span>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Warehouse Operations & Dispatch Dock */}
              <div className="space-y-4">
                {/* Pillar Header Banner */}
                <div className="p-3.5 rounded-2xl bg-[#E8F8F0]/70 dark:bg-[#1A2D22]/50 dark:border dark:border-[#2D2520] shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-[#168051] text-white shadow-2xs">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#168051] dark:text-[#78E0A9] uppercase tracking-wider">
                        Warehouse Operations & Dock
                      </h4>
                      <p className="text-[10px] text-[#7D756D] dark:text-[#A89F95]">
                        Bays 1-4 • Fleet Logistics & Staging
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#168051]/10 text-[#168051] dark:text-[#78E0A9]">
                    Pillar 2
                  </span>
                </div>

                {/* Lead Node: Vikram Deshmukh */}
                {dispatchLead && renderClayNode(dispatchLead, 'Level 2: Dock Lead', 'emerald', 'Staging & Bay Supervision')}

                {/* Downward Wire with Sub-Reports Badge */}
                <div className="flex flex-col items-center py-1">
                  <div className="w-0.5 h-4 bg-[#168051]/40 dark:bg-[#168051]/60" />
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8F8F0] dark:bg-[#1A2D22] text-[#168051] dark:text-[#78E0A9] text-[9px] font-extrabold uppercase tracking-wider shadow-2xs">
                    Direct Floor Reports (2 Operatives)
                  </span>
                  <div className="w-0.5 h-4 bg-[#168051]/40 dark:bg-[#168051]/60" />
                </div>

                {/* Operative 1: Amit Verma (Forklift & Dock Packer) */}
                {dockPacker && renderClayNode(dockPacker, 'Level 3: Floor Lead', 'emerald', 'Reports to: Vikram Deshmukh', 'Dock Packing')}

                {/* Downward Wire */}
                <div className="w-0.5 h-3 bg-[#168051]/30 dark:bg-[#168051]/50 mx-auto" />

                {/* Operative 2: Sunita Gupta (Inventory Auditor) */}
                {inventoryAuditor && renderClayNode(inventoryAuditor, 'Level 3: Auditor', 'emerald', 'Reports to: Vikram Deshmukh', 'Inventory Audit')}
              </div>

              {/* Pillar 3: Solar Trading & Procurement */}
              <div className="space-y-4">
                {/* Pillar Header Banner */}
                <div className="p-3.5 rounded-2xl bg-[#FEF6E6]/70 dark:bg-[#2D2115]/50 dark:border dark:border-[#2D2520] shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-[#A87208] text-white shadow-2xs">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#A87208] dark:text-[#FCD34D] uppercase tracking-wider">
                        Trading & Inbound Sourcing
                      </h4>
                      <p className="text-[10px] text-[#7D756D] dark:text-[#A89F95]">
                        Commercial Accounts & Hedging
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#A87208]/10 text-[#A87208] dark:text-[#FCD34D]">
                    Pillar 3
                  </span>
                </div>

                {/* Lead Node: Suresh Nair */}
                {tradingLead && renderClayNode(tradingLead, 'Level 2: Trading Lead', 'amber', 'Commercial Accounts & Hedging')}

                {/* Downward Wire with Sub-Report Badge */}
                <div className="flex flex-col items-center py-1">
                  <div className="w-0.5 h-4 bg-[#A87208]/40 dark:bg-[#A87208]/60" />
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FEF6E6] dark:bg-[#2D2115] text-[#A87208] dark:text-[#FCD34D] text-[9px] font-extrabold uppercase tracking-wider shadow-2xs">
                    Procurement Desk (1 Report)
                  </span>
                  <div className="w-0.5 h-4 bg-[#A87208]/40 dark:bg-[#A87208]/60" />
                </div>

                {/* Operative: Ananya Reddy (Procurement Specialist) */}
                {procurementSpecialist && renderClayNode(procurementSpecialist, 'Level 3: Sourcing', 'amber', 'Reports to: Suresh Nair', 'BOS & Vendor Sourcing')}

                {/* Downward Wire */}
                <div className="w-0.5 h-3 bg-[#A87208]/30 dark:bg-[#A87208]/50 mx-auto" />

                {/* Tier-1 Inbound Sourcing Desk Node */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFFDF8] to-[#FEF6E6] dark:from-[#261E17] dark:to-[#1E1712] dark:border dark:border-[#2D2520] shadow-[0_4px_16px_-2px_rgba(168,114,8,0.1)] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#A87208] dark:text-[#FCD34D] flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Tier-1 Sourcing Desk</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#EEF4FF] text-[#2E5AAC] dark:bg-[#1E2638] dark:text-[#93B4F5]">
                      4 Inbound POs
                    </span>
                  </div>
                  <p className="text-xs text-[#5C5247] dark:text-[#D4CCC0]">
                    Direct Liaison for Mono PERC & TOPCon Cell Hedging
                  </p>
                  <div className="pt-2 border-t border-[#FDE3B2]/80 dark:border-[#382B21] flex items-center justify-between text-[10px] text-[#8F867C] dark:text-[#A89F95]">
                    <span>Scope: BOS Components</span>
                    <span className="font-semibold text-[#A87208] dark:text-[#FCD34D]">Customs Valuation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 3. NON-PERMANENT & CONTRACT WORKFORCE SECTION (Requested by User) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-4">
        <div>
          <h3 className="text-sm font-black text-[#1C1613] dark:text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#A87208] dark:text-[#FCD34D]" />
            <span>On-Demand Non-Permanent Personnel (Delivery Drivers & Solar Installers)</span>
          </h3>
          <p className="text-xs text-[#7D756D] dark:text-[#A89F95] mt-0.5">
            Verified contract heavy vehicle drivers, certified rooftop technicians, and crane specialists with instant booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contractors.map((cont) => {
            const statusBg =
              cont.status === 'Available'
                ? 'bg-[#E8F8F0] text-[#168051] border-[#C6EED8] dark:bg-[#1A2D22] dark:text-[#78E0A9]'
                : 'bg-[#FEF6E6] text-[#A6680C] border-[#FDE3B2] dark:bg-[#2D2115] dark:text-[#FCD34D]';

            return (
              <div
                key={cont.id}
                className="p-5 rounded-2xl dark:border dark:border-[#2D2520] bg-[#FBF9F5] dark:bg-[#201A16] shadow-[0_2px_8px_-2px_rgba(40,30,20,0.03)] space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#1C1613] dark:text-white">{cont.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBg}`}>
                        ● {cont.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#A87208] dark:text-[#FCD34D] font-semibold">{cont.type}</p>
                    <p className="text-[10px] text-[#8F867C]">{cont.agencyOrFleet}</p>
                  </div>

                  <div className="text-right">
                    <span className="flex items-center justify-end gap-1 text-xs font-bold text-[#A87208] dark:text-[#FCD34D]">
                      <Star className="w-3.5 h-3.5 fill-[#FCD34D] text-[#A87208]" />
                      {cont.rating} ({cont.completedJobsCount} jobs)
                    </span>
                    <span className="text-[11px] font-black text-[#1C1613] dark:text-[#FAF7F2] mt-0.5 block">
                      ₹{cont.ratePerDayINR.toLocaleString('en-IN')}/day
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[#5C5247] dark:text-[#D4CCC0] space-y-1">
                  {cont.vehicleNumber && (
                    <p className="font-mono text-[11px]">
                      Vehicle: <strong className="text-[#1C1613] dark:text-white">{cont.vehicleNumber}</strong>
                    </p>
                  )}
                  <p className="text-[11px] text-[#8F867C]">
                    Recent: <span className="text-[#1C1613] dark:text-[#FAF7F2] font-medium">{cont.recentProject}</span>
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1">
                  {cont.verifiedBadges.map((badge, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg text-[10px] bg-[#F4F0E8] dark:bg-[#28201A] text-[#5C5247] dark:text-[#D4CCC0] font-semibold dark:border dark:border-[#352B24] shadow-2xs"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Instant Actions: Call & Book Button */}
                <div className="pt-2 border-t border-[#EBE7DF]/60 dark:border-[#2D2520] flex items-center justify-between">
                  <a
                    href={`tel:${cont.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1C1613] dark:text-[#FAF7F2] hover:bg-[#EAE4D8] dark:hover:bg-[#2C231E] bg-white dark:bg-[#2C231E] dark:border dark:border-[#2D2520] shadow-2xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call ({cont.phone})</span>
                  </a>

                  <button
                    onClick={() => {
                      setBookingContractor(cont);
                      setBookingProjectNote('SO-9102 Solar Dispatch Truck Bay 4');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FCD34D] hover:bg-[#fbbf24] text-[#1C1613] shadow-xs transition-all"
                  >
                    <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Book / Assign</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Employee Extended Management Drawer / Modal */}
      {selectedEmployeeForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1613]/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-[#1A1512] rounded-3xl dark:border dark:border-[#2D2520] shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmployeeForModal.avatarUrl}
                  alt={selectedEmployeeForModal.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-[#FCD34D]"
                />
                <div>
                  <h3 className="text-base font-black text-[#1C1613] dark:text-white">
                    {selectedEmployeeForModal.name}
                  </h3>
                  <p className="text-xs text-[#A87208] dark:text-[#FCD34D] font-bold">
                    {selectedEmployeeForModal.role} ({selectedEmployeeForModal.department})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployeeForModal(null)}
                className="p-1.5 rounded-xl text-[#8F867C] hover:text-[#1C1613] hover:bg-[#F4F0E8] dark:hover:bg-[#28201A] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Compensation & Holidays Overview */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FBF9F5] dark:bg-[#201A16] dark:border dark:border-[#2D2520] shadow-2xs">
                <span className="text-[#8F867C] uppercase font-bold text-[10px]">
                  Monthly Compensation
                </span>
                <p className="text-base font-black text-[#1C1613] dark:text-white mt-0.5">
                  ₹{selectedEmployeeForModal.monthlyPayoutINR.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">PF & ESIC Compliant</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FBF9F5] dark:bg-[#201A16] dark:border dark:border-[#2D2520] shadow-2xs">
                <span className="text-[#8F867C] uppercase font-bold text-[10px]">
                  Holidays & Paid Leave Balance
                </span>
                <p className="text-base font-black text-[#1C1613] dark:text-white mt-0.5">
                  {selectedEmployeeForModal.leavesBalance} Days Available
                </p>
                <p className="text-[10px] text-[#8F867C] mt-0.5">Tenure: {selectedEmployeeForModal.tenureMonths} Months</p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-3.5 rounded-2xl bg-[#FBF9F5] dark:bg-[#201A16] dark:border dark:border-[#2D2520] shadow-2xs text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#8F867C]">Official Mobile:</span>
                <span className="font-mono font-bold text-[#1C1613] dark:text-[#FAF7F2]">
                  {selectedEmployeeForModal.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8F867C]">Email:</span>
                <span className="font-mono text-[#5C5247] dark:text-[#D4CCC0]">
                  {selectedEmployeeForModal.email}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedEmployeeForModal(null)}
                className="px-5 py-2 rounded-2xl text-xs font-bold bg-[#FCD34D] hover:bg-[#fbbf24] text-[#1C1613] shadow-xs transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Contractor Modal */}
      {bookingContractor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1613]/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-[#1A1512] rounded-3xl dark:border dark:border-[#2D2520] shadow-2xl p-6 space-y-4">
            <div>
              <h3 className="text-sm font-black text-[#1C1613] dark:text-white">
                Book & Dispatch Contractor ({bookingContractor.name})
              </h3>
              <p className="text-xs text-[#7D756D] dark:text-[#A89F95] mt-0.5">
                Contract Daily Rate: ₹{bookingContractor.ratePerDayINR.toLocaleString('en-IN')}/day
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
                  Assignment Project & Loading Bay
                </label>
                <input
                  type="text"
                  required
                  value={bookingProjectNote}
                  onChange={(e) => setBookingProjectNote(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingContractor(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#7D756D] hover:bg-[#F4F0E8] dark:hover:bg-[#28201A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl text-xs font-bold bg-[#FCD34D] hover:bg-[#fbbf24] text-[#1C1613] shadow-xs transition-all"
                >
                  Confirm Booking & Send SMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Reassignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1613]/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-[#1A1512] rounded-3xl dark:border dark:border-[#2D2520] shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-black text-[#1C1613] dark:text-white">
              Reassign Sales Order Staff
            </h3>
            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
                  Sales Order
                </label>
                <select
                  value={assignOrderId}
                  onChange={(e) => setAssignOrderId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} — {o.customer.company}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
                  Assign Trader
                </label>
                <select
                  value={assignTrader}
                  onChange={(e) => setAssignTrader(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                >
                  <option value="Suresh Nair">Suresh Nair (Senior Trader)</option>
                  <option value="Ananya Reddy">Ananya Reddy (Procurement Trader)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1613] dark:text-[#FAF7F2] mb-1">
                  Assign QC Inspector
                </label>
                <select
                  value={assignInspector}
                  onChange={(e) => setAssignInspector(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                >
                  <option value="Priya Patel">Priya Patel (Lead QC Engineer)</option>
                  <option value="Amit Verma">Amit Verma (Dock Inspector)</option>
                  <option value="Vikram Deshmukh">Vikram Deshmukh (Dispatch Supervisor)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#7D756D] hover:bg-[#F4F0E8] dark:hover:bg-[#28201A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl text-xs font-bold bg-[#FCD34D] hover:bg-[#fbbf24] text-[#1C1613] shadow-xs transition-all"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


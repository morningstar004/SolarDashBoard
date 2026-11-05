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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)]">
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
          <div className="flex items-center p-1 rounded-2xl bg-[#F4F0E8] dark:bg-[#241E19] border border-[#EBE7DF] dark:border-[#352B24]">
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
                className="p-5 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-4 hover:border-[#FCD34D]/60 transition-all flex flex-col justify-between"
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
                  <div className="mt-4 p-3 rounded-2xl bg-[#FBF9F5] dark:bg-[#201A16] border border-[#EBE7DF] dark:border-[#2D2520] text-xs space-y-1.5">
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
                <div className="pt-3 border-t border-[#EBE7DF] dark:border-[#2D2520] flex items-center justify-between">
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
      {viewMode === 'hierarchical' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-6">
          <div className="text-center max-w-sm mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F867C]">
              Operations Leadership
            </span>
            <div className="mt-2 p-4 rounded-3xl bg-[#FEF6E6] dark:bg-[#2D2115] border-2 border-[#FCD34D] shadow-xs text-center">
              <div className="w-14 h-14 rounded-full overflow-hidden mx-auto border-2 border-[#FCD34D]">
                <img
                  src={employees[0].avatarUrl}
                  alt={employees[0].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-sm font-bold text-[#1C1613] dark:text-white mt-2">
                {employees[0].name}
              </h4>
              <p className="text-xs font-semibold text-[#A87208] dark:text-[#FCD34D]">{employees[0].role}</p>
              <p className="text-[10px] text-[#8F867C]">{employees[0].department}</p>
            </div>
            <div className="w-0.5 h-8 bg-[#FCD34D] mx-auto"></div>
          </div>

          {/* Departmental Branches */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Branch 1: Quality Control & Inspection */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#FBF9F5] dark:bg-[#201A16] border border-[#EBE7DF] dark:border-[#2D2520]">
              <h4 className="text-xs font-bold text-[#2E5AAC] dark:text-[#93B4F5] uppercase tracking-wider">
                Quality Control Division
              </h4>
              {employees
                .filter((e) => e.department === 'Quality Control')
                .map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => setSelectedEmployeeForModal(emp)}
                    className="cursor-pointer p-3 rounded-xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] hover:border-[#FCD34D] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={emp.avatarUrl} alt={emp.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-[#1C1613] dark:text-white">{emp.name}</p>
                        <p className="text-[10px] text-[#8F867C]">{emp.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Branch 2: Warehouse Dock & Dispatch */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#FBF9F5] dark:bg-[#201A16] border border-[#EBE7DF] dark:border-[#2D2520]">
              <h4 className="text-xs font-bold text-[#168051] dark:text-[#78E0A9] uppercase tracking-wider">
                Warehouse & Staging Dock
              </h4>
              {employees
                .filter((e) => e.department === 'Warehouse Operations' && e.id !== 'emp-101')
                .map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => setSelectedEmployeeForModal(emp)}
                    className="cursor-pointer p-3 rounded-xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] hover:border-[#FCD34D] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={emp.avatarUrl} alt={emp.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-[#1C1613] dark:text-white">{emp.name}</p>
                        <p className="text-[10px] text-[#8F867C]">{emp.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Branch 3: Solar Trading & Procurement */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#FBF9F5] dark:bg-[#201A16] border border-[#EBE7DF] dark:border-[#2D2520]">
              <h4 className="text-xs font-bold text-[#A87208] dark:text-[#FCD34D] uppercase tracking-wider">
                Trading, Sales & Procurement
              </h4>
              {employees
                .filter((e) => e.department === 'Solar Trading & Sales' || e.department === 'Procurement')
                .map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => setSelectedEmployeeForModal(emp)}
                    className="cursor-pointer p-3 rounded-xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] hover:border-[#FCD34D] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={emp.avatarUrl} alt={emp.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-[#1C1613] dark:text-white">{emp.name}</p>
                        <p className="text-[10px] text-[#8F867C]">{emp.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. NON-PERMANENT & CONTRACT WORKFORCE SECTION (Requested by User) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-4">
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
                className="p-5 rounded-2xl border border-[#EBE7DF] dark:border-[#2D2520] bg-[#FBF9F5] dark:bg-[#201A16] space-y-3"
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
                      className="px-2 py-0.5 rounded-lg text-[10px] bg-[#F4F0E8] dark:bg-[#28201A] text-[#5C5247] dark:text-[#D4CCC0] font-semibold border border-[#E8E3DA] dark:border-[#352B24]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Instant Actions: Call & Book Button */}
                <div className="pt-2 border-t border-[#EBE7DF] dark:border-[#2D2520] flex items-center justify-between">
                  <a
                    href={`tel:${cont.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1C1613] dark:text-[#FAF7F2] hover:bg-[#EAE4D8] dark:hover:bg-[#2C231E] border border-[#EBE7DF] dark:border-[#2D2520] transition-colors"
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
          <div className="w-full max-w-lg bg-white dark:bg-[#1A1512] rounded-3xl border border-[#EBE7DF] dark:border-[#2D2520] shadow-2xl p-6 space-y-4">
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
              <div className="p-3.5 rounded-2xl bg-[#FBF9F5] dark:bg-[#201A16] border border-[#EBE7DF] dark:border-[#2D2520]">
                <span className="text-[#8F867C] uppercase font-bold text-[10px]">
                  Monthly Compensation
                </span>
                <p className="text-base font-black text-[#1C1613] dark:text-white mt-0.5">
                  ₹{selectedEmployeeForModal.monthlyPayoutINR.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">PF & ESIC Compliant</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FBF9F5] dark:bg-[#201A16] border border-[#EBE7DF] dark:border-[#2D2520]">
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
            <div className="p-3.5 rounded-2xl bg-[#FBF9F5] dark:bg-[#201A16] border border-[#EBE7DF] dark:border-[#2D2520] text-xs space-y-1.5">
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
          <div className="w-full max-w-md bg-white dark:bg-[#1A1512] rounded-3xl border border-[#EBE7DF] dark:border-[#2D2520] shadow-2xl p-6 space-y-4">
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
          <div className="w-full max-w-md bg-white dark:bg-[#1A1512] rounded-3xl border border-[#EBE7DF] dark:border-[#2D2520] shadow-2xl p-6 space-y-4">
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


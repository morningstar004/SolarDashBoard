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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <span>Team Management & Floor Operations Roster</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Internal warehouse team, duty check-in logs, and on-demand certified solar drivers & contractors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('simple')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'simple'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Simple Cards View</span>
            </button>

            <button
              onClick={() => setViewMode('hierarchical')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'hierarchical'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Hierarchical Org View</span>
            </button>
          </div>

          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all"
          >
            <UserCheck className="w-3.5 h-3.5" />
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
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300'
                : emp.status === 'Reviewing POs'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300'
                : emp.status === 'On Break'
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300'
                : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300';

            return (
              <div
                key={emp.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-amber-400/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Avatar & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-500/30 shrink-0">
                        <img
                          src={emp.avatarUrl}
                          alt={emp.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {emp.name}
                        </h3>
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          {emp.role}
                        </p>
                        <p className="text-[10px] text-slate-400">{emp.department}</p>
                      </div>
                    </div>

                    <select
                      value={emp.status}
                      onChange={(e) => updateEmployeeStatus(emp.id, e.target.value as WorkloadStatus)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${statusColor}`}
                    >
                      <option value="Active on Dock">Active on Dock</option>
                      <option value="Reviewing POs">Reviewing POs</option>
                      <option value="On Break">On Break</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>

                  {/* Current Work & Check-in Time */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-amber-500" />
                        Today Check-in:
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {emp.checkInTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Shift:</span>
                      <span className="text-slate-700 dark:text-slate-300 text-[11px] font-mono">
                        {emp.shift.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Active Orders Assigned:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {emp.activeOrdersCount} orders
                      </span>
                    </div>
                  </div>

                  {/* Certifications badges */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {emp.certifications.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Actions: Extend / Manage Employee */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Rating: <strong className="text-amber-500">{emp.rating} ★</strong>
                  </div>

                  <button
                    onClick={() => setSelectedEmployeeForModal(emp)}
                    className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700"
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
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="text-center max-w-sm mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Operations Leadership
            </span>
            <div className="mt-2 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500 shadow-sm text-center">
              <div className="w-14 h-14 rounded-full overflow-hidden mx-auto border-2 border-amber-500">
                <img
                  src={employees[0].avatarUrl}
                  alt={employees[0].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                {employees[0].name}
              </h4>
              <p className="text-xs font-medium text-amber-600">{employees[0].role}</p>
              <p className="text-[10px] text-slate-400">{employees[0].department}</p>
            </div>
            <div className="w-0.5 h-8 bg-amber-400 mx-auto"></div>
          </div>

          {/* Departmental Branches */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Branch 1: Quality Control & Inspection */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                Quality Control Division
              </h4>
              {employees
                .filter((e) => e.department === 'Quality Control')
                .map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => setSelectedEmployeeForModal(emp)}
                    className="cursor-pointer p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={emp.avatarUrl} alt={emp.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{emp.name}</p>
                        <p className="text-[10px] text-slate-500">{emp.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Branch 2: Warehouse Dock & Dispatch */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Warehouse & Staging Dock
              </h4>
              {employees
                .filter((e) => e.department === 'Warehouse Operations' && e.id !== 'emp-101')
                .map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => setSelectedEmployeeForModal(emp)}
                    className="cursor-pointer p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={emp.avatarUrl} alt={emp.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{emp.name}</p>
                        <p className="text-[10px] text-slate-500">{emp.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Branch 3: Solar Trading & Procurement */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Trading, Sales & Procurement
              </h4>
              {employees
                .filter((e) => e.department === 'Solar Trading & Sales' || e.department === 'Procurement')
                .map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => setSelectedEmployeeForModal(emp)}
                    className="cursor-pointer p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={emp.avatarUrl} alt={emp.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{emp.name}</p>
                        <p className="text-[10px] text-slate-500">{emp.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. NON-PERMANENT & CONTRACT WORKFORCE SECTION (Requested by User) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-sky-500" />
            <span>On-Demand Non-Permanent Personnel (Delivery Drivers & Solar Installers)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified contract heavy vehicle drivers, certified rooftop technicians, and crane specialists with instant booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contractors.map((cont) => {
            const statusBg =
              cont.status === 'Available'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';

            return (
              <div
                key={cont.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cont.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusBg}`}>
                        {cont.status}
                      </span>
                    </div>
                    <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">{cont.type}</p>
                    <p className="text-[10px] text-slate-400">{cont.agencyOrFleet}</p>
                  </div>

                  <div className="text-right">
                    <span className="flex items-center justify-end gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {cont.rating} ({cont.completedJobsCount} jobs)
                    </span>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                      ₹{cont.ratePerDayINR.toLocaleString('en-IN')}/day
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  {cont.vehicleNumber && (
                    <p className="font-mono text-[11px]">
                      Vehicle: <strong>{cont.vehicleNumber}</strong>
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400">
                    Recent: <span className="text-slate-600 dark:text-slate-300">{cont.recentProject}</span>
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1">
                  {cont.verifiedBadges.map((badge, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-200/80 dark:bg-slate-750 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Instant Actions: Call & Book Button */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <a
                    href={`tel:${cont.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Call ({cont.phone})</span>
                  </a>

                  <button
                    onClick={() => {
                      setBookingContractor(cont);
                      setBookingProjectNote('SO-9102 Solar Dispatch Truck Bay 4');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmployeeForModal.avatarUrl}
                  alt={selectedEmployeeForModal.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedEmployeeForModal.name}
                  </h3>
                  <p className="text-xs text-amber-600 font-medium">
                    {selectedEmployeeForModal.role} ({selectedEmployeeForModal.department})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployeeForModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Compensation & Holidays Overview */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">
                  Monthly Compensation
                </span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  ₹{selectedEmployeeForModal.monthlyPayoutINR.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-emerald-600 mt-0.5">PF & ESIC Compliant</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">
                  Holidays & Paid Leave Balance
                </span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedEmployeeForModal.leavesBalance} Days Available
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Tenure: {selectedEmployeeForModal.tenureMonths} Months</p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Official Mobile:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {selectedEmployeeForModal.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {selectedEmployeeForModal.email}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedEmployeeForModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Contractor Modal */}
      {bookingContractor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Book & Dispatch Contractor ({bookingContractor.name})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Contract Daily Rate: ₹{bookingContractor.ratePerDayINR.toLocaleString('en-IN')}/day
            </p>

            <form onSubmit={handleBookingSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assignment Project & Loading Bay
                </label>
                <input
                  type="text"
                  required
                  value={bookingProjectNote}
                  onChange={(e) => setBookingProjectNote(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingContractor(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Reassign Sales Order Staff
            </h3>
            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sales Order
                </label>
                <select
                  value={assignOrderId}
                  onChange={(e) => setAssignOrderId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} — {o.customer.company}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assign Trader
                </label>
                <select
                  value={assignTrader}
                  onChange={(e) => setAssignTrader(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  <option value="Suresh Nair">Suresh Nair (Senior Trader)</option>
                  <option value="Ananya Reddy">Ananya Reddy (Procurement Trader)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assign QC Inspector
                </label>
                <select
                  value={assignInspector}
                  onChange={(e) => setAssignInspector(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
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
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
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


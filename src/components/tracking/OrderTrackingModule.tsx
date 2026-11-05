'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  FileText,
  Calendar,
  AlertTriangle,
  User,
  ArrowRight,
} from 'lucide-react';

export const OrderTrackingModule: React.FC = () => {
  const {
    orders,
    selectedOrderIdForTracking,
    setSelectedOrderIdForTracking,
    setActiveTab,
    setSelectedOrderIdForChecklist,
  } = useApp();

  const currentOrder = orders.find((o) => o.id === selectedOrderIdForTracking) || orders[0];

  const [activeTabSub, setActiveTabSub] = useState<'timeline' | 'gps'>('timeline');

  // Milestone stages
  const stages = [
    { name: 'Order Placed', desc: 'Proforma confirmed', done: true },
    { name: 'Pallet Staging', desc: 'Forklift staged to Bay 4', done: true },
    {
      name: 'Pre-Dispatch QC',
      desc: currentOrder.checklistSignoff ? 'Signed & sealed' : 'Pending verification',
      done: !!currentOrder.checklistSignoff,
    },
    {
      name: 'Vehicle Loading',
      desc: currentOrder.status === 'Dispatched' || currentOrder.status === 'In Transit' || currentOrder.status === 'Delivered'
        ? 'Loaded onto transporter'
        : 'Dock Gate 2',
      done: currentOrder.status === 'Dispatched' || currentOrder.status === 'In Transit' || currentOrder.status === 'Delivered',
    },
    {
      name: 'In-Transit GPS',
      desc: currentOrder.status === 'In Transit' || currentOrder.status === 'Delivered' ? 'On Highway' : 'Awaiting departure',
      done: currentOrder.status === 'In Transit' || currentOrder.status === 'Delivered',
    },
    {
      name: 'Site Delivery',
      desc: currentOrder.status === 'Delivered' ? 'POD Accepted' : currentOrder.logistics.estimatedDeliveryDate,
      done: currentOrder.status === 'Delivered',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Order Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500 text-white shadow-sm shadow-sky-500/20">
              <Truck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Fleet Logistics & Live Order Tracking</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border border-sky-300">
                  {currentOrder.logistics.partner}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lorry Receipt (LR) tracking, driver check-in logs, and simulated GPS route progression.
              </p>
            </div>
          </div>
        </div>

        {/* Order Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Tracking Order:</span>
          <select
            value={selectedOrderIdForTracking}
            onChange={(e) => setSelectedOrderIdForTracking(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            {orders.map((ord) => (
              <option key={ord.id} value={ord.id}>
                {ord.id} — {ord.customer.company} ({ord.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transporter Details & Key Logistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Transporter Profile */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Transporter Fleet
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              Verified Partner
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {currentOrder.logistics.partner}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hub: Bhiwandi Central Logistics Yard (MH)
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Vehicle Number:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {currentOrder.logistics.vehicleNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Trailer Type:</span>
              <span className="text-slate-700 dark:text-slate-300">
                {currentOrder.logistics.trailerType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Waybill / LR #:</span>
              <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                {currentOrder.logistics.lrNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Driver & Dispatch Contact */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Vehicle Pilot & Crew
            </span>
            <a
              href={`tel:${currentOrder.logistics.driverPhone}`}
              className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <Phone className="w-3 h-3" />
              <span>Call Pilot</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
              <User className="w-5 h-5 text-sky-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {currentOrder.logistics.driverName}
              </p>
              <p className="text-xs font-mono text-slate-500">{currentOrder.logistics.driverPhone}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-xs space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Security Seal Stamped:</p>
            <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {currentOrder.checklistSignoff?.sealNumber || 'Pending Signoff Verification'}
            </p>
          </div>
        </div>

        {/* Card 3: Destination & ETA */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Delivery Schedule
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              {currentOrder.status}
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-400">Estimated Site Arrival:</p>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {currentOrder.logistics.estimatedDeliveryDate}
            </h3>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>{currentOrder.customer.fullAddress}</span>
          </div>
        </div>
      </div>

      {/* 6-Stage Visual Milestone Timeline */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Fulfillment & Dispatch Milestones</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs transition-all ${
                stage.done
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400">0{idx + 1}</span>
                {stage.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                )}
              </div>
              <p className="font-bold text-slate-900 dark:text-white mt-1.5">{stage.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{stage.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Interactive Live GPS Route Map & Driver History */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-sky-500" />
              <span>Simulated Highway Route Map (Bhiwandi Depot → {currentOrder.customer.destinationCity})</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Live telemetry via transporter onboard GPS tracking unit.
            </p>
          </div>

          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>GPS Beacon Active</span>
          </span>
        </div>

        {/* Animated Highway Route Graphic */}
        <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 p-6 overflow-hidden text-white min-h-[220px] flex flex-col justify-between">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400 ring-4 ring-amber-400/20"></div>
              <div>
                <p className="text-xs font-bold text-amber-400">Origin: Bhiwandi Central Depot</p>
                <p className="text-[10px] text-slate-400">Dispatched: {currentOrder.logistics.dispatchedAt || 'Today 06:15 IST'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-right">
              <div>
                <p className="text-xs font-bold text-emerald-400">Destination: {currentOrder.customer.destinationCity}</p>
                <p className="text-[10px] text-slate-400">ETA: {currentOrder.logistics.estimatedDeliveryDate}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20"></div>
            </div>
          </div>

          {/* Interactive animated route line */}
          <div className="relative z-10 my-6">
            <div className="w-full h-1.5 bg-slate-700 rounded-full relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-sky-400 to-emerald-500 rounded-full transition-all duration-1000"
                style={{ width: `${currentOrder.logistics.gpsCoordinates?.progressPercent || 48}%` }}
              ></div>
            </div>

            {/* Truck Icon position */}
            <div
              className="absolute -top-3.5 transition-all duration-1000 flex flex-col items-center"
              style={{ left: `calc(${currentOrder.logistics.gpsCoordinates?.progressPercent || 48}% - 14px)` }}
            >
              <div className="p-1 rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/50">
                <Truck className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <span className="text-[9px] font-mono text-sky-300 font-bold mt-1">
                {currentOrder.logistics.gpsCoordinates?.progressPercent || 48}% Completed
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between text-xs text-slate-300 border-t border-slate-800 pt-3">
            <div className="flex items-center gap-4">
              <span>Current Speed: <strong className="text-white">62 km/h</strong></span>
              <span>Next Waypoint: <strong className="text-white">Talegaon Highway Plaza</strong></span>
              <span>Weather: <strong className="text-emerald-400">Clear 28°C</strong></span>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Vehicle Tag: {currentOrder.logistics.vehicleNumber} ({currentOrder.logistics.partner})
            </div>
          </div>
        </div>

        {/* Audit Log Table of Movements */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Carrier Check-in History Logs:
          </h4>
          <div className="space-y-1.5">
            {currentOrder.timeline.map((evt, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{evt.title}</span>
                  <span className="text-slate-400">— {evt.description}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">{evt.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

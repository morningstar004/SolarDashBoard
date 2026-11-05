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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-[#FEF6E6] dark:bg-[#2D2115] text-[#A87208] dark:text-[#FCD34D] border border-[#FDE3B2] dark:border-[#4B3722]">
              <Truck className="w-5 h-5 stroke-[2.2]" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#1C1613] dark:text-[#F7F4EF] flex items-center gap-2">
                <span>Fleet Logistics & Live Order Tracking</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF4FF] text-[#2E5AAC] dark:bg-[#1E2638] dark:text-[#93B4F5] border border-[#CCDDFE] dark:border-[#2E3C56]">
                  {currentOrder.logistics.partner}
                </span>
              </h2>
              <p className="text-xs text-[#7D756D] dark:text-[#A89F95] mt-0.5">
                Lorry Receipt (LR) tracking, driver check-in logs, and simulated GPS route progression.
              </p>
            </div>
          </div>
        </div>

        {/* Order Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#8F867C]">Tracking Order:</span>
          <select
            value={selectedOrderIdForTracking}
            onChange={(e) => setSelectedOrderIdForTracking(e.target.value)}
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-[#F8F5EE] dark:bg-[#221B17] border border-[#E8E3DA] dark:border-[#352B24] text-[#1C1613] dark:text-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#FCD34D] cursor-pointer"
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
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8F867C]">
              Transporter Fleet
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF4FF] text-[#2E5AAC] dark:bg-[#1E2638] dark:text-[#93B4F5] border border-[#CCDDFE] dark:border-[#2E3C56]">
              Verified Partner
            </span>
          </div>

          <div>
            <h3 className="text-base font-black text-[#1C1613] dark:text-white">
              {currentOrder.logistics.partner}
            </h3>
            <p className="text-xs text-[#7D756D] dark:text-[#A89F95] mt-0.5">
              Hub: Bhiwandi Central Logistics Yard (MH)
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FBF9F5] dark:bg-[#201A16] border border-[#EBE7DF] dark:border-[#2D2520] text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#8F867C]">Vehicle Number:</span>
              <span className="font-mono font-bold text-[#1C1613] dark:text-white">
                {currentOrder.logistics.vehicleNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8F867C]">Trailer Type:</span>
              <span className="text-[#5C5247] dark:text-[#D4CCC0] font-medium">
                {currentOrder.logistics.trailerType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8F867C]">Waybill / LR #:</span>
              <span className="font-mono text-[#A87208] dark:text-[#FCD34D] font-bold">
                {currentOrder.logistics.lrNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Driver & Dispatch Contact */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8F867C]">
              Vehicle Pilot & Crew
            </span>
            <a
              href={`tel:${currentOrder.logistics.driverPhone}`}
              className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              <Phone className="w-3 h-3" />
              <span>Call Pilot</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F4F0E8] dark:bg-[#241E19] flex items-center justify-center font-bold text-[#1C1613] dark:text-white border border-[#EBE7DF] dark:border-[#352B24]">
              <User className="w-5 h-5 text-[#A87208] dark:text-[#FCD34D]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1C1613] dark:text-white">
                {currentOrder.logistics.driverName}
              </p>
              <p className="text-xs font-mono text-[#8F867C]">{currentOrder.logistics.driverPhone}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FBF9F5] dark:bg-[#201A16] border border-[#EBE7DF] dark:border-[#2D2520] text-xs space-y-1">
            <p className="text-[10px] text-[#8F867C] uppercase font-bold">Security Seal Stamped:</p>
            <p className="font-mono font-bold text-[#168051] dark:text-[#78E0A9]">
              {currentOrder.checklistSignoff?.sealNumber || 'Pending Signoff Verification'}
            </p>
          </div>
        </div>

        {/* Card 3: Destination & ETA */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8F867C]">
              Delivery Schedule
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF6E6] text-[#A6680C] dark:bg-[#2D2115] dark:text-[#FCD34D] border border-[#FDE3B2] dark:border-[#4B3722]">
              ● {currentOrder.status}
            </span>
          </div>

          <div>
            <p className="text-xs text-[#8F867C]">Estimated Site Arrival:</p>
            <h3 className="text-base font-black text-[#1C1613] dark:text-white mt-0.5">
              {currentOrder.logistics.estimatedDeliveryDate}
            </h3>
          </div>

          <div className="flex items-start gap-2 text-xs text-[#5C5247] dark:text-[#D4CCC0]">
            <MapPin className="w-4 h-4 text-[#A87208] dark:text-[#FCD34D] shrink-0 mt-0.5" />
            <span>{currentOrder.customer.fullAddress}</span>
          </div>
        </div>
      </div>

      {/* 6-Stage Visual Milestone Timeline */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1613] dark:text-[#F7F4EF] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#A87208] dark:text-[#FCD34D]" />
          <span>Fulfillment & Dispatch Milestones</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-xs transition-all ${
                stage.done
                  ? 'bg-[#E8F8F0] dark:bg-[#1A2D22] border-[#C6EED8] dark:border-[#2C4837]'
                  : 'bg-[#FBF9F5] dark:bg-[#201A16] border-[#EBE7DF] dark:border-[#2D2520] opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#8F867C] font-bold">0{idx + 1}</span>
                {stage.done ? (
                  <CheckCircle2 className="w-4 h-4 text-[#168051] dark:text-[#78E0A9]" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[#D4CCC0] dark:bg-[#4A3D34]"></span>
                )}
              </div>
              <p className="font-bold text-[#1C1613] dark:text-white mt-1.5">{stage.name}</p>
              <p className="text-[11px] text-[#7D756D] dark:text-[#A89F95] mt-0.5">{stage.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Interactive Live GPS Route Map & Driver History */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1512] border border-[#EBE7DF] dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1613] dark:text-[#F7F4EF] flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#A87208] dark:text-[#FCD34D]" />
              <span>Simulated Highway Route Map (Bhiwandi Depot → {currentOrder.customer.destinationCity})</span>
            </h3>
            <p className="text-[11px] text-[#7D756D] dark:text-[#A89F95] mt-0.5">
              Live telemetry via transporter onboard GPS tracking unit.
            </p>
          </div>

          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>GPS Beacon Active</span>
          </span>
        </div>

        {/* Animated Highway Route Graphic - Warm Espresso Clay Dark container */}
        <div className="relative rounded-3xl border border-[#2D2520] bg-[#1C1613] p-6 overflow-hidden text-white min-h-[220px] flex flex-col justify-between shadow-inner">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FCD34D_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FCD34D] ring-4 ring-[#FCD34D]/20"></div>
              <div>
                <p className="text-xs font-bold text-[#FCD34D]">Origin: Bhiwandi Central Depot</p>
                <p className="text-[10px] text-[#A89F95]">Dispatched: {currentOrder.logistics.dispatchedAt || 'Today 06:15 IST'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-right">
              <div>
                <p className="text-xs font-bold text-emerald-400">Destination: {currentOrder.customer.destinationCity}</p>
                <p className="text-[10px] text-[#A89F95]">ETA: {currentOrder.logistics.estimatedDeliveryDate}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20"></div>
            </div>
          </div>

          {/* Interactive animated route line */}
          <div className="relative z-10 my-6">
            <div className="w-full h-2 bg-[#2D2520] rounded-full relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FCD34D] via-[#FBBF24] to-emerald-400 rounded-full transition-all duration-1000"
                style={{ width: `${currentOrder.logistics.gpsCoordinates?.progressPercent || 48}%` }}
              ></div>
            </div>

            {/* Truck Icon position */}
            <div
              className="absolute -top-3.5 transition-all duration-1000 flex flex-col items-center"
              style={{ left: `calc(${currentOrder.logistics.gpsCoordinates?.progressPercent || 48}% - 14px)` }}
            >
              <div className="p-1.5 rounded-full bg-[#FCD34D] text-[#1C1613] shadow-lg shadow-[#FCD34D]/40">
                <Truck className="w-3.5 h-3.5 animate-pulse stroke-[2.5]" />
              </div>
              <span className="text-[9px] font-mono text-[#FCD34D] font-bold mt-1">
                {currentOrder.logistics.gpsCoordinates?.progressPercent || 48}% Completed
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between text-xs text-[#D4CCC0] border-t border-[#2D2520] pt-3">
            <div className="flex items-center gap-4">
              <span>Current Speed: <strong className="text-white">62 km/h</strong></span>
              <span>Next Waypoint: <strong className="text-white">Talegaon Highway Plaza</strong></span>
              <span>Weather: <strong className="text-emerald-400">Clear 28°C</strong></span>
            </div>

            <div className="text-[11px] text-[#A89F95] font-mono">
              Vehicle Tag: {currentOrder.logistics.vehicleNumber} ({currentOrder.logistics.partner})
            </div>
          </div>
        </div>

        {/* Audit Log Table of Movements */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#1C1613] dark:text-[#F7F4EF]">
            Carrier Check-in History Logs:
          </h4>
          <div className="space-y-1.5">
            {currentOrder.timeline.map((evt, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FBF9F5] dark:bg-[#201A16] border border-[#EBE7DF] dark:border-[#2D2520] text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-[#1C1613] dark:text-[#FAF7F2]">{evt.title}</span>
                  <span className="text-[#7D756D] dark:text-[#A89F95]">— {evt.description}</span>
                </div>
                <span className="font-mono text-[10px] text-[#8F867C] font-semibold">{evt.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


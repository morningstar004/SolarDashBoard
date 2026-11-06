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
  Compass,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Activity,
  Layers,
  Radio,
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

  // View switch mode: Live Map View vs Expressway Telemetry
  const [trackingViewMode, setTrackingViewMode] = useState<'map' | 'corridor'>('map');
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [mapStyle, setMapStyle] = useState<'terrain' | 'satellite'>('terrain');

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
      {/* Header & Order Selector - Outer div borderless in light mode */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)]">
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

      {/* Transporter Details & Key Logistics Cards - Outer divs borderless in light mode */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Transporter Profile */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-3">
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
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-3">
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
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-3">
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

      {/* 6-Stage Visual Milestone Timeline - Outer div borderless in light mode */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-4">
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

      {/* Mock Interactive Live GPS Route Map & Driver History - Outer div borderless in light mode */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1512] dark:border dark:border-[#2D2520] shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)] space-y-4">
        {/* Header with Horizontal Selection Option on Top Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1613] dark:text-[#F7F4EF] flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#A87208] dark:text-[#FCD34D]" />
              <span>
                {trackingViewMode === 'map'
                  ? `Live Satellite & GPS Route Map (Bhiwandi Depot → ${currentOrder.customer.destinationCity})`
                  : `Expressway Corridor Telemetry (Bhiwandi Depot → ${currentOrder.customer.destinationCity})`}
              </span>
            </h3>
            <p className="text-[11px] text-[#7D756D] dark:text-[#A89F95] mt-0.5">
              Live telemetry via transporter onboard GPS tracking unit.
            </p>
          </div>

          {/* Horizontal Selection Option on Top Right */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center bg-[#F4F0E8] dark:bg-[#241E19] p-1 rounded-2xl border border-[#EBE7DF] dark:border-[#352B24]">
              <button
                type="button"
                onClick={() => setTrackingViewMode('map')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  trackingViewMode === 'map'
                    ? 'bg-[#1C1613] text-[#FCD34D] dark:bg-[#FCD34D] dark:text-[#1C1613] shadow-xs'
                    : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613] dark:hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Live Map View</span>
              </button>

              <button
                type="button"
                onClick={() => setTrackingViewMode('corridor')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  trackingViewMode === 'corridor'
                    ? 'bg-[#1C1613] text-[#FCD34D] dark:bg-[#FCD34D] dark:text-[#1C1613] shadow-xs'
                    : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1C1613] dark:hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Expressway Telemetry</span>
              </button>
            </div>

            <span className="hidden md:flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 pl-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>GPS Active</span>
            </span>
          </div>
        </div>

        {/* View Mode 1: Live Interactive GPS Topographic Map View */}
        {trackingViewMode === 'map' && (
          <div className="relative rounded-3xl border border-[#2D2520] bg-[#14100E] p-4 sm:p-5 overflow-hidden text-white min-h-[420px] flex flex-col justify-between shadow-2xl">
            {/* Top Bar Floating Over Map */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 bg-[#1C1613]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#382E27]">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#FCD34D]">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Fleet Unit: {currentOrder.logistics.vehicleNumber}</span>
                </div>
                <span className="text-[#6B635B]">•</span>
                <span className="text-[#D4CCC0] font-mono text-[11px]">
                  GPS: 18.9842° N, 73.1259° E
                </span>
                <span className="text-[#6B635B] hidden sm:inline">•</span>
                <span className="text-emerald-400 font-bold hidden sm:inline">
                  Speed: 62 km/h (Normal Cruise)
                </span>
              </div>

              {/* Map Zoom & Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setMapZoom((z) => Math.max(0.85, z - 0.15))}
                  className="p-1.5 rounded-lg bg-[#2B231D] hover:bg-[#382E26] text-[#D4CCC0] hover:text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[10px] text-[#A89F95] px-1">
                  {Math.round(mapZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setMapZoom((z) => Math.min(1.4, z + 0.15))}
                  className="p-1.5 rounded-lg bg-[#2B231D] hover:bg-[#382E26] text-[#D4CCC0] hover:text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMapZoom(1)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2B231D] hover:bg-[#382E26] text-[11px] font-semibold text-[#FCD34D] transition-colors ml-1"
                  title="Center on Vehicle"
                >
                  <Crosshair className="w-3 h-3" />
                  <span>Center</span>
                </button>
              </div>
            </div>

            {/* SVG Topographic GPS Map Graphics */}
            <div className="relative w-full h-[280px] sm:h-[300px] my-2 overflow-hidden flex items-center justify-center">
              <svg
                viewBox="0 0 900 400"
                className="w-full h-full transition-transform duration-300 select-none"
                style={{ transform: `scale(${mapZoom})` }}
              >
                <defs>
                  {/* Subtle Grid Pattern */}
                  <pattern id="gpsGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2B221B" strokeWidth="0.8" />
                  </pattern>
                  {/* Glow Filters */}
                  <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  {/* Linear Gradient for Traversed Path */}
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FCD34D" />
                    <stop offset="60%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>

                {/* Map Grid Background */}
                <rect width="900" height="400" fill="url(#gpsGrid)" />

                {/* Geographical Elevation Contour Outlines (Western Ghats Sahyadri Ridges) */}
                <path
                  d="M 50 160 Q 220 180 340 130 T 600 170 T 880 200"
                  fill="none"
                  stroke="#231B16"
                  strokeWidth="24"
                  opacity="0.6"
                />
                <path
                  d="M 280 40 Q 420 120 480 220 T 680 340"
                  fill="none"
                  stroke="#2E231C"
                  strokeWidth="32"
                  opacity="0.5"
                />
                <path
                  d="M 320 80 Q 450 160 520 250 T 720 370"
                  fill="none"
                  stroke="#382A22"
                  strokeWidth="16"
                  opacity="0.4"
                />

                {/* Secondary Feeder Roads */}
                <path
                  d="M 120 70 L 190 20 L 260 50"
                  fill="none"
                  stroke="#3A2E26"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 420 220 L 520 160 L 640 180"
                  fill="none"
                  stroke="#3A2E26"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 560 270 L 620 230 L 750 250"
                  fill="none"
                  stroke="#3A2E26"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Main Transit Highway Route (NH-48 Mumbai-Pune Expressway) */}
                {/* 1. Underlying road bed */}
                <path
                  d="M 120 70 C 200 110, 260 160, 360 200 C 440 230, 520 250, 620 280 C 700 300, 760 320, 800 330"
                  fill="none"
                  stroke="#2E231C"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* 2. Traversed Path (Bhiwandi to Current Vehicle Position ~55%) */}
                <path
                  d="M 120 70 C 200 110, 260 160, 360 200 C 440 230, 480 240, 500 246"
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#routeGlow)"
                />

                {/* 3. Upcoming Path to Destination (dashed) */}
                <path
                  d="M 500 246 C 540 256, 620 280, 700 300 C 760 320, 800 330, 800 330"
                  fill="none"
                  stroke="#FCD34D"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  opacity="0.8"
                />

                {/* Geographic Landmark Labels */}
                <text x="120" y="50" fill="#FCD34D" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Bhiwandi Hub Gate #2
                </text>
                <text x="260" y="145" fill="#8F867C" fontSize="9" textAnchor="middle">
                  Thane Golden Dike
                </text>
                <text x="360" y="185" fill="#8F867C" fontSize="9" textAnchor="middle">
                  Khalapur Toll
                </text>
                <text x="440" y="215" fill="#10B981" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Lonavala Bhor Ghat
                </text>
                <text x="640" y="265" fill="#8F867C" fontSize="9" textAnchor="middle">
                  Talegaon Solar Interchange
                </text>
                <text x="800" y="355" fill="#10B981" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {currentOrder.customer.destinationCity} (Site)
                </text>

                {/* Waypoint 1: Origin Depot Pin */}
                <g transform="translate(120, 70)">
                  <circle r="8" fill="#FCD34D" />
                  <circle r="14" fill="#FCD34D" opacity="0.2" />
                  <circle r="3" fill="#1C1613" />
                </g>

                {/* Waypoint 2: Thane Toll */}
                <g transform="translate(260, 160)">
                  <circle r="4" fill="#10B981" />
                </g>

                {/* Waypoint 3: Khalapur Toll */}
                <g transform="translate(360, 200)">
                  <circle r="4" fill="#10B981" />
                </g>

                {/* Waypoint 4: Destination Pin */}
                <g transform="translate(800, 330)">
                  <circle r="8" fill="#10B981" />
                  <circle r="16" fill="#10B981" opacity="0.2" />
                  <circle r="3" fill="#FFFFFF" />
                </g>

                {/* LIVE VEHICLE BEACON (Position at Lonavala Ghat ~ X:500, Y:246) */}
                <g transform="translate(500, 246)">
                  {/* Radar Wave Ping Animations */}
                  <circle r="22" fill="#FCD34D" opacity="0.15">
                    <animate attributeName="r" values="8;30;40" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.2;0" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle r="12" fill="#FCD34D" opacity="0.4" />
                  <circle r="6" fill="#FCD34D" />

                  {/* Vehicle Marker Pin & Tooltip */}
                  <g transform="translate(0, -28)">
                    <rect x="-65" y="-14" width="130" height="24" rx="12" fill="#1C1613" stroke="#FCD34D" strokeWidth="1.5" />
                    <text x="0" y="2" fill="#FCD34D" fontSize="9" fontWeight="900" textAnchor="middle">
                      🚛 {currentOrder.logistics.vehicleNumber} (62 km/h)
                    </text>
                  </g>
                </g>
              </svg>
            </div>

            {/* Bottom Floating Telemetry HUD Badges */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-t border-[#2D2520] pt-3 text-xs text-[#D4CCC0]">
              <div className="flex flex-wrap items-center gap-4">
                <span>
                  Corridor:{' '}
                  <strong className="text-white">NH-48 Expressway (KM 68.4)</strong>
                </span>
                <span>
                  Waybill:{' '}
                  <strong className="text-[#FCD34D] font-mono">{currentOrder.logistics.lrNumber}</strong>
                </span>
                <span>
                  Altitude: <strong className="text-white">580m ASL</strong>
                </span>
                <span>
                  Weather: <strong className="text-emerald-400">Clear 28°C</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#8F867C]">Est. Arrival:</span>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800 font-bold font-mono text-[11px]">
                  {currentOrder.logistics.estimatedDeliveryDate}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: Linear Expressway Telemetry (Existing Flow) */}
        {trackingViewMode === 'corridor' && (
          <div className="relative rounded-3xl border border-[#2D2520] bg-[#1C1613] p-6 overflow-hidden text-white min-h-[220px] flex flex-col justify-between shadow-inner">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FCD34D_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FCD34D] ring-4 ring-[#FCD34D]/20"></div>
                <div>
                  <p className="text-xs font-bold text-[#FCD34D]">Origin: Bhiwandi Central Depot</p>
                  <p className="text-[10px] text-[#A89F95]">
                    Dispatched: {currentOrder.logistics.dispatchedAt || 'Today 06:15 IST'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right">
                <div>
                  <p className="text-xs font-bold text-emerald-400">
                    Destination: {currentOrder.customer.destinationCity}
                  </p>
                  <p className="text-[10px] text-[#A89F95]">
                    ETA: {currentOrder.logistics.estimatedDeliveryDate}
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20"></div>
              </div>
            </div>

            {/* Interactive animated route line */}
            <div className="relative z-10 my-6">
              <div className="w-full h-2 bg-[#2D2520] rounded-full relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FCD34D] via-[#FBBF24] to-emerald-400 rounded-full transition-all duration-1000"
                  style={{ width: `${currentOrder.logistics.gpsCoordinates?.progressPercent || 59}%` }}
                ></div>
              </div>

              {/* Truck Icon position */}
              <div
                className="absolute -top-3.5 transition-all duration-1000 flex flex-col items-center"
                style={{
                  left: `calc(${currentOrder.logistics.gpsCoordinates?.progressPercent || 59}% - 14px)`,
                }}
              >
                <div className="p-1.5 rounded-full bg-[#FCD34D] text-[#1C1613] shadow-lg shadow-[#FCD34D]/40">
                  <Truck className="w-3.5 h-3.5 animate-pulse stroke-[2.5]" />
                </div>
                <span className="text-[9px] font-mono text-[#FCD34D] font-bold mt-1">
                  {currentOrder.logistics.gpsCoordinates?.progressPercent || 59}% Completed
                </span>
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between text-xs text-[#D4CCC0] border-t border-[#2D2520] pt-3">
              <div className="flex items-center gap-4">
                <span>
                  Current Speed: <strong className="text-white">62 km/h</strong>
                </span>
                <span>
                  Next Waypoint: <strong className="text-white">Talegaon Highway Plaza</strong>
                </span>
                <span>
                  Weather: <strong className="text-emerald-400">Clear 28°C</strong>
                </span>
              </div>

              <div className="text-[11px] text-[#A89F95] font-mono">
                Vehicle Tag: {currentOrder.logistics.vehicleNumber} ({currentOrder.logistics.partner})
              </div>
            </div>
          </div>
        )}

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


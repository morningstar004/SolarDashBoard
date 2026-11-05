'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ChecklistPhoto, DiscrepancyReport } from '@/types';
import {
  ClipboardCheck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Upload,
  UserCheck,
  Truck,
  Printer,
  FileCheck,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
  Lock,
  Unlock,
  Check,
  X,
  Eye,
  Tag,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PreDispatchChecklistModule: React.FC = () => {
  const {
    orders,
    selectedOrderIdForChecklist,
    setSelectedOrderIdForChecklist,
    updateItemPackedQty,
    updateItemCondition,
    addChecklistPhoto,
    addDiscrepancy,
    signoffChecklist,
    updateOrderStatus,
    setActiveTab,
    setSelectedOrderIdForTracking,
    addToast,
  } = useApp();

  const currentOrder = orders.find((o) => o.id === selectedOrderIdForChecklist) || orders[0];

  // Signoff state
  const [packerName, setPackerName] = useState('Amit Verma');
  const [packerVerified, setPackerVerified] = useState(true);
  const [supervisorName, setSupervisorName] = useState('Vikram Deshmukh');
  const [supervisorRemarks, setSupervisorRemarks] = useState(
    'All 48x Waaree bifacial panels inspected under flash test. Sungrow inverters serial numbers match manifest. Pallets secured with high-tensile strapping.'
  );
  const [sealNumber, setSealNumber] = useState('SEAL-MH-2026-9042');

  // Photo upload modal state
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoStage, setPhotoStage] = useState<ChecklistPhoto['stage']>('Pallet Strapping');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  // Discrepancy modal state
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);
  const [discrepancyProduct, setDiscrepancyProduct] = useState(currentOrder.items[0]?.productId || '');
  const [discrepancyType, setDiscrepancyType] = useState<DiscrepancyReport['type']>('Cracked Glass / Cell Defect');
  const [discrepancySeverity, setDiscrepancySeverity] = useState<'Blocker' | 'Minor'>('Blocker');
  const [discrepancyQty, setDiscrepancyQty] = useState(1);
  const [discrepancyNotes, setDiscrepancyNotes] = useState('');

  // Calculate checklist completeness
  const totalRequired = currentOrder.items.reduce((sum, item) => sum + item.requiredQty, 0);
  const totalPacked = currentOrder.items.reduce((sum, item) => sum + item.packedQty, 0);
  const isAllPacked = totalPacked >= totalRequired;

  const allConditionChecksPassed = currentOrder.items.every(
    (item) =>
      item.conditionCheck?.factorySeal &&
      item.conditionCheck?.visualPassed &&
      item.conditionCheck?.qcTested &&
      item.conditionCheck?.palletStrapped
  );

  const isSignedOff = !!currentOrder.checklistSignoff;

  const handleMarkAllPacked = (productId: string, requiredQty: number) => {
    updateItemPackedQty(currentOrder.id, productId, requiredQty);
  };

  const handleConditionToggle = (
    productId: string,
    field: 'factorySeal' | 'visualPassed' | 'qcTested' | 'palletStrapped'
  ) => {
    const item = currentOrder.items.find((i) => i.productId === productId);
    if (!item) return;
    const current = item.conditionCheck || {
      factorySeal: false,
      visualPassed: false,
      qcTested: false,
      palletStrapped: false,
    };
    updateItemCondition(currentOrder.id, productId, {
      ...current,
      [field]: !current[field],
    });
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const photo: ChecklistPhoto = {
      id: `photo-${Date.now()}`,
      url:
        photoUrlInput ||
        'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
      caption: photoCaption || `${photoStage} verification snapshot`,
      stage: photoStage,
      timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
      uploadedBy: packerName,
    };
    addChecklistPhoto(currentOrder.id, photo);
    setShowPhotoModal(false);
    setPhotoCaption('');
    setPhotoUrlInput('');
  };

  const handleSaveDiscrepancy = (e: React.FormEvent) => {
    e.preventDefault();
    const targetItem = currentOrder.items.find((i) => i.productId === discrepancyProduct);
    const report: DiscrepancyReport = {
      id: `disc-${Date.now()}`,
      productId: discrepancyProduct,
      productName: targetItem?.productName || 'Solar Equipment',
      type: discrepancyType,
      severity: discrepancySeverity,
      quantityAffected: discrepancyQty,
      reportedBy: packerName,
      reportedAt: new Date().toLocaleTimeString('en-IN') + ' IST',
      notes: discrepancyNotes || 'Identified during dock staging inspection.',
      status: 'Open',
    };
    addDiscrepancy(currentOrder.id, report);
    setShowDiscrepancyModal(false);
    setDiscrepancyNotes('');
  };

  const handleExecuteSignoff = () => {
    if (!isAllPacked) {
      addToast({
        title: 'Sign-off Prevented by Safety Interlock',
        message: 'Cannot sign off until all itemized required quantities are 100% packed.',
        type: 'error',
      });
      return;
    }

    if (!packerVerified) {
      addToast({
        title: 'Packer Verification Required',
        message: 'Warehouse packer must verify physical pallet count before supervisor stamp.',
        type: 'warning',
      });
      return;
    }

    signoffChecklist(currentOrder.id, {
      packerName,
      supervisorName,
      supervisorRemarks,
      sealNumber,
    });

    // Trigger celebratory confetti for certified QC signoff!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6'],
      });
    } catch (e) {
      // ignore
    }
  };

  const handleDispatchLoadedTruck = () => {
    updateOrderStatus(currentOrder.id, 'Dispatched');
    setSelectedOrderIdForTracking(currentOrder.id);
    setActiveTab('tracking');
  };

  const handlePrintManifest = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Order Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/20">
              <ClipboardCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Pre-Dispatch Loading Checklist & Warehouse QC</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300">
                  Critical Interlock
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mandatory dual-signoff gate before vehicle loading at Bhiwandi Bay #4.
              </p>
            </div>
          </div>
        </div>

        {/* Order Selector Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Select Order:</span>
          <select
            value={selectedOrderIdForChecklist}
            onChange={(e) => setSelectedOrderIdForChecklist(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            {orders.map((ord) => (
              <option key={ord.id} value={ord.id}>
                {ord.id} — {ord.customer.company} ({ord.status})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrintManifest}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Print Dispatch Manifest & Gate Pass"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Manifest</span>
          </button>
        </div>
      </div>

      {/* Order Info & Transporter Dispatch Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Customer & EPC Site</span>
          <p className="font-bold text-slate-900 dark:text-white mt-0.5">{currentOrder.customer.name}</p>
          <p className="text-slate-600 dark:text-slate-300">{currentOrder.customer.company}</p>
          <p className="text-[11px] text-slate-400 mt-1">{currentOrder.customer.fullAddress}</p>
          <p className="font-mono text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
            GSTIN: {currentOrder.customer.gstin}
          </p>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Transporter & Fleet</span>
          <p className="font-bold text-slate-900 dark:text-white mt-0.5">{currentOrder.logistics.partner}</p>
          <p className="font-mono font-bold text-slate-700 dark:text-slate-300 text-xs mt-0.5">
            Vehicle: {currentOrder.logistics.vehicleNumber}
          </p>
          <p className="text-slate-500 mt-0.5">
            Driver: {currentOrder.logistics.driverName} ({currentOrder.logistics.driverPhone})
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">{currentOrder.logistics.trailerType}</p>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Packing Progress</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {totalPacked} / {totalRequired}
            </span>
            <span className="text-xs text-slate-400">units verified</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isAllPacked ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, (totalPacked / (totalRequired || 1)) * 100)}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {isAllPacked ? '✓ 100% Items Ready for Loading' : 'Awaiting physical count completion'}
          </p>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Gate QC Status</span>
          <div className="mt-1">
            {isSignedOff ? (
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pre-Dispatch Approved</span>
                </div>
                <p className="text-[10px] font-mono mt-0.5">
                  Seal #{currentOrder.checklistSignoff?.sealNumber}
                </p>
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>Pending Dual Sign-off</span>
                </div>
                <p className="text-[10px] mt-0.5">Loading blocked until supervisor signs.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Itemized Verification Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-amber-500" />
              <span>Itemized Packing & Condition Checklist</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Check physical seals, visual condition, voltage QC, and strapping for every line item.
            </p>
          </div>

          <button
            onClick={() => setShowDiscrepancyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 transition-colors"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Report Damaged / Missing Item</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Equipment Line Item</th>
                <th className="px-4 py-3">Required vs Packed Qty</th>
                <th className="px-4 py-3">Serial Numbers Logged</th>
                <th className="px-4 py-3">Condition Verification Checks</th>
                <th className="px-4 py-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {currentOrder.items.map((item) => {
                const condition = item.conditionCheck || {
                  factorySeal: false,
                  visualPassed: false,
                  qcTested: false,
                  palletStrapped: false,
                };
                const isItemComplete = item.packedQty === item.requiredQty;

                return (
                  <tr key={item.productId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    {/* Equipment Description */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{item.productName}</div>
                      <div className="text-[11px] text-slate-400">
                        {item.brand} • <span className="font-medium text-amber-600">{item.category}</span>
                      </div>
                    </td>

                    {/* Required vs Packed Quantity Counter */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          disabled={isSignedOff}
                          onClick={() =>
                            updateItemPackedQty(currentOrder.id, item.productId, item.packedQty - 1)
                          }
                          className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center justify-center disabled:opacity-40"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span className="font-mono font-bold text-sm min-w-[50px] text-center">
                          <span
                            className={
                              isItemComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'
                            }
                          >
                            {item.packedQty}
                          </span>{' '}
                          / {item.requiredQty}
                        </span>

                        <button
                          disabled={isSignedOff}
                          onClick={() =>
                            updateItemPackedQty(currentOrder.id, item.productId, item.packedQty + 1)
                          }
                          className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center justify-center disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Serial Numbers */}
                    <td className="px-4 py-3.5">
                      {item.serialNumbers && item.serialNumbers.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {item.serialNumbers.map((s, idx) => (
                            <span
                              key={idx}
                              className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Bulk Pallet (Batch verification)</span>
                      )}
                    </td>

                    {/* Condition Verification Badges / Checkboxes */}
                    <td className="px-4 py-3.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        <label
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold border cursor-pointer select-none transition-all ${
                            condition.factorySeal
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={isSignedOff}
                            checked={condition.factorySeal}
                            onChange={() => handleConditionToggle(item.productId, 'factorySeal')}
                            className="rounded text-emerald-600 focus:ring-0 w-3 h-3"
                          />
                          <span>Factory Seal Intact</span>
                        </label>

                        <label
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold border cursor-pointer select-none transition-all ${
                            condition.visualPassed
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={isSignedOff}
                            checked={condition.visualPassed}
                            onChange={() => handleConditionToggle(item.productId, 'visualPassed')}
                            className="rounded text-emerald-600 focus:ring-0 w-3 h-3"
                          />
                          <span>Visual Inspection OK</span>
                        </label>

                        <label
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold border cursor-pointer select-none transition-all ${
                            condition.qcTested
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={isSignedOff}
                            checked={condition.qcTested}
                            onChange={() => handleConditionToggle(item.productId, 'qcTested')}
                            className="rounded text-emerald-600 focus:ring-0 w-3 h-3"
                          />
                          <span>Voltage / QC Passed</span>
                        </label>

                        <label
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold border cursor-pointer select-none transition-all ${
                            condition.palletStrapped
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={isSignedOff}
                            checked={condition.palletStrapped}
                            onChange={() => handleConditionToggle(item.productId, 'palletStrapped')}
                            className="rounded text-emerald-600 focus:ring-0 w-3 h-3"
                          />
                          <span>Pallet Strapped</span>
                        </label>
                      </div>
                    </td>

                    {/* Quick Button: All Packed */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {!isItemComplete && !isSignedOff && (
                        <button
                          onClick={() => handleMarkAllPacked(item.productId, item.requiredQty)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 transition-colors"
                        >
                          Pack All ({item.requiredQty})
                        </button>
                      )}
                      {isItemComplete && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                          <Check className="w-3.5 h-3.5" />
                          <span>Ready</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discrepancy Alert Banner (If Any Reported) */}
      {currentOrder.discrepancies && currentOrder.discrepancies.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900/60 space-y-2">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Active Loading Dock Discrepancies ({currentOrder.discrepancies.length})</span>
          </div>
          {currentOrder.discrepancies.map((d) => (
            <div
              key={d.id}
              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 text-xs flex items-start justify-between"
            >
              <div>
                <span className="font-bold text-rose-700 dark:text-rose-400">[{d.severity}]</span>{' '}
                <strong className="text-slate-900 dark:text-white">{d.type}</strong> on {d.productName} ({d.quantityAffected} units affected)
                <p className="text-slate-600 dark:text-slate-300 mt-1">{d.notes}</p>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                  Reported by {d.reportedBy} at {d.reportedAt}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {d.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Photo Evidence & Packing Attachments Gallery */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-500" />
              <span>Packing & Loading Photo Documentation ({currentOrder.photos?.length || 0})</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Photographic proof of pallet wrap, barcode serials, and container interior prior to vehicle gate departure.
            </p>
          </div>

          <button
            onClick={() => setShowPhotoModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Attach Dock Photo</span>
          </button>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {(currentOrder.photos || []).map((photo) => (
            <div
              key={photo.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/40 group"
            >
              <div className="h-36 overflow-hidden relative">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-sm">
                  {photo.stage}
                </span>
              </div>
              <div className="p-2.5 text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {photo.caption}
                </p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                  <span>By {photo.uploadedBy}</span>
                  <span className="font-mono">{photo.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Verification & Final Dispatch Sign-Off Section */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/30 dark:from-slate-900 dark:to-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Dual Verification & Warehouse Supervisor Sign-Off
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Packer confirmation and supervisor approval are mandatory to authorize transporter gate departure.
              </p>
            </div>
          </div>

          {isSignedOff && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Certified Approved</span>
            </span>
          )}
        </div>

        {isSignedOff ? (
          /* Stamped Sign-off Certificate Box */
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <p className="text-xs text-slate-400">Digital Sign-off Token</p>
                <p className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400">
                  {currentOrder.checklistSignoff?.digitalSignatureToken}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-slate-400">Verified Timestamp</p>
                <p className="font-mono text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  {currentOrder.checklistSignoff?.supervisorSignedAt}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Warehouse Packer:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {currentOrder.checklistSignoff?.packerName}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Supervisor Approver:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {currentOrder.checklistSignoff?.supervisorName}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Security Seal #:</span>
                <p className="font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  {currentOrder.checklistSignoff?.sealNumber}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Supervisor Remarks:</span>
              <p className="text-slate-700 dark:text-slate-200 mt-0.5 italic">
                "{currentOrder.checklistSignoff?.supervisorRemarks}"
              </p>
            </div>

            {/* If order is approved but not yet dispatched, show Launch Vehicle Dispatch button! */}
            {currentOrder.status === 'Pre-Dispatch Approved' && (
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={handleDispatchLoadedTruck}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/30 transition-all animate-bounce"
                >
                  <Truck className="w-4 h-4" />
                  <span>Authorize Gate Departure (Dispatch Vehicle)</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Signoff Form Inputs */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Warehouse Packer Name
                </label>
                <input
                  type="text"
                  value={packerName}
                  onChange={(e) => setPackerName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Supervisor Signer Name
                </label>
                <input
                  type="text"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tamper-Evident Seal #
                </label>
                <input
                  type="text"
                  value={sealNumber}
                  onChange={(e) => setSealNumber(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Supervisor Remarks & Handover Notes
              </label>
              <textarea
                rows={2}
                value={supervisorRemarks}
                onChange={(e) => setSupervisorRemarks(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={packerVerified}
                  onChange={(e) => setPackerVerified(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0"
                />
                <span>I confirm that all physical pallet tags, voltages & counts were verified on dock.</span>
              </label>

              <button
                type="button"
                onClick={handleExecuteSignoff}
                disabled={!isAllPacked}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-md shadow-emerald-600/20 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Stamp Supervisor QC Sign-off</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Attach Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-500" />
                <span>Attach Dock Loading Evidence Photo</span>
              </h3>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Inspection Stage Tag
                </label>
                <select
                  value={photoStage}
                  onChange={(e) => setPhotoStage(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  <option value="Pallet Strapping">Pallet Strapping & Edge Guards</option>
                  <option value="Serial Label">Serial Barcode Label Verification</option>
                  <option value="High-Voltage Crate">High-Voltage Battery / Inverter Crate</option>
                  <option value="Truck Loading">Truck Bay Container Loading</option>
                  <option value="Damage Evidence">Damage Evidence Snapshot</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Photo Caption / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Waaree 545W Pallet 1 strapping and shrinkwrap verified"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Image URL / Camera Snapshot (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Leave blank for automatic sample dock snapshot"
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                >
                  Save Photo Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discrepancy Reporting Modal */}
      {showDiscrepancyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span>Report Missing / Damaged Equipment</span>
              </h3>
              <button
                onClick={() => setShowDiscrepancyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDiscrepancy} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Affected Equipment
                </label>
                <select
                  value={discrepancyProduct}
                  onChange={(e) => setDiscrepancyProduct(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  {currentOrder.items.map((item) => (
                    <option key={item.productId} value={item.productId}>
                      {item.productName} ({item.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Issue Classification
                  </label>
                  <select
                    value={discrepancyType}
                    onChange={(e) => setDiscrepancyType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Cracked Glass / Cell Defect">Cracked Glass / Cell Defect</option>
                    <option value="Dented Inverter Casing">Dented Inverter Casing</option>
                    <option value="Missing Item">Missing from Staging Area</option>
                    <option value="Torn Pallet Packaging">Torn Pallet Packaging</option>
                    <option value="Faulty Connector">Faulty Connector</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Severity
                  </label>
                  <select
                    value={discrepancySeverity}
                    onChange={(e) => setDiscrepancySeverity(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Blocker">Blocker (Must Replace from Stock)</option>
                    <option value="Minor">Minor (Client Waived / Cosmetic)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity Affected
                </label>
                <input
                  type="number"
                  min={1}
                  value={discrepancyQty}
                  onChange={(e) => setDiscrepancyQty(parseInt(e.target.value) || 1)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Investigation Remarks & Action
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detail the defect and whether a replacement unit is being pulled from Bay A..."
                  value={discrepancyNotes}
                  onChange={(e) => setDiscrepancyNotes(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDiscrepancyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                >
                  Log Discrepancy & Quarantine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const icon =
          toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : toast.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-[#A87208] dark:text-[#FCD34D] shrink-0 mt-0.5" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-[#2E5AAC] dark:text-[#93B4F5] shrink-0 mt-0.5" />
          );

        const borderBg =
          toast.type === 'success'
            ? 'border-[#C6EED8] bg-[#E8F8F0]/95 dark:bg-[#1A2D22]/95 text-[#168051] dark:text-[#78E0A9]'
            : toast.type === 'warning'
            ? 'border-[#FDE3B2] bg-[#FEF6E6]/95 dark:bg-[#2D2115]/95 text-[#A6680C] dark:text-[#FCD34D]'
            : toast.type === 'error'
            ? 'border-rose-200 bg-rose-50/95 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
            : 'border-[#CCDDFE] bg-[#EEF4FF]/95 dark:bg-[#1E2638]/95 text-[#2E5AAC] dark:text-[#93B4F5]';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 ${borderBg}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black text-[#1C1613] dark:text-white">{toast.title}</h4>
              <p className="text-xs text-[#5C5247] dark:text-[#D4CCC0] mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#8F867C] hover:text-[#1C1613] dark:hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};


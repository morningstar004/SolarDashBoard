import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { ToastContainer } from '@/components/common/Toast';

export const metadata: Metadata = {
  title: 'HeliosOps — Solar Equipment Distribution & Logistics OS',
  description:
    'Comprehensive operational dashboard for solar equipment distribution: Panels, Inverters, Batteries, Racking, and Cabling across India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-amber-500 selection:text-white transition-colors duration-200">
        <AppProvider>
          {children}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}

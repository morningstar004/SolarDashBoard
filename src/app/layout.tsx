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
      <body className="min-h-screen bg-[#FBF9F5] dark:bg-[#120F0D] text-[#1C1613] dark:text-[#F7F4EF] antialiased selection:bg-[#FCD34D] selection:text-[#1C1613] transition-colors duration-200">
        <AppProvider>
          {children}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}

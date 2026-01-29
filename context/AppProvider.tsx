'use client';

import { ReactNode } from 'react';
import { EquipmentProvider } from './EquipmentContext';
import { ToastProvider } from '@/components/ui/Toast';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <EquipmentProvider>
      <ToastProvider>{children}</ToastProvider>
    </EquipmentProvider>
  );
}

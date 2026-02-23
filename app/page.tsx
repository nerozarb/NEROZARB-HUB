'use client';

import { AuthProvider } from '@/context/auth-context';
import { DataProvider } from '@/context/data-context';
import MainLayout from '@/components/main-layout';

export default function Home() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainLayout />
      </DataProvider>
    </AuthProvider>
  );
}

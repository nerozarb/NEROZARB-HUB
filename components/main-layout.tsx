'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import AuthScreen from '@/components/auth-screen';
import Sidebar from '@/components/sidebar';
import CommandCenter from '@/components/command-center';
import ClientOS from '@/components/client-os';
import FulfillmentOS from '@/components/fulfillment-os';
import ContentCalendarOS from '@/components/content-calendar';
import KnowledgeVaultOS from '@/components/knowledge-vault';
import { motion, AnimatePresence } from 'motion/react';

export default function MainLayout() {
  const { role, isInitialized } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isInitialized) return null;

  if (!role) {
    return <AuthScreen />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CommandCenter setActiveTab={setActiveTab} />;
      case 'clients':
        return <ClientOS setActiveTab={setActiveTab} />;
      case 'fulfillment':
        return <FulfillmentOS />;
      case 'content':
        return <ContentCalendarOS />;
      case 'vault':
        return <KnowledgeVaultOS />;
      default:
        return <CommandCenter setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-onyx flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 ml-64 p-8 lg:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

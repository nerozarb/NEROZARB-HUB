'use client';

import React from 'react';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Zap, 
  Calendar, 
  BookOpen, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { role, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, ceoOnly: false },
    { id: 'clients', label: 'Client OS', icon: Users, ceoOnly: false },
    { id: 'fulfillment', label: 'Fulfillment', icon: Zap, ceoOnly: false },
    { id: 'content', label: 'Content Cal', icon: Calendar, ceoOnly: false },
    { id: 'vault', label: 'Knowledge Vault', icon: BookOpen, ceoOnly: false },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-border flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-display tracking-tighter">
          NEROZARB<span className="text-accent">.</span>
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full",
            role === 'CEO' ? "bg-accent" : "bg-blue-500"
          )} />
          <span className="mono-tag text-[9px]">{role} ACCESS</span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          if (item.ceoOnly && role !== 'CEO') return null;
          
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-sm transition-all group",
                isActive 
                  ? "bg-accent/10 text-white border-l-2 border-accent" 
                  : "text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "w-4 h-4",
                  isActive ? "text-accent" : "text-muted group-hover:text-white"
                )} />
                <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3 h-3 text-accent" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-sm transition-all group"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Terminate Session</span>
        </button>
      </div>
    </aside>
  );
}

'use client';

import React, { useState } from 'react';
import { useData } from '@/context/data-context';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Plus, 
  Book, 
  FileText, 
  Zap, 
  Shield, 
  ExternalLink,
  ChevronRight,
  Folder
} from 'lucide-react';
import { motion } from 'motion/react';

export default function KnowledgeVaultOS() {
  const { role } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['SOPs', 'AI Prompts', 'Client Assets', 'Legal', 'Strategy'];
  
  const protocols = [
    { id: '1', title: 'Client Onboarding Flow', category: 'SOPs', pillar: 'Ops', updatedAt: '2026-02-20' },
    { id: '2', title: 'Viral Reel Script Structure', category: 'AI Prompts', pillar: 'Content', updatedAt: '2026-02-21' },
    { id: '3', title: 'Meta Ads Scaling Protocol', category: 'Strategy', pillar: 'Growth', updatedAt: '2026-02-18' },
    { id: '4', title: 'Agency Master Contract', category: 'Legal', pillar: 'Admin', updatedAt: '2026-01-15' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display tracking-tighter">Knowledge Vault</h1>
          <p className="mono-tag mt-1">Institutional Memory & SOP Repository</p>
        </div>
        <button className="bg-accent hover:bg-accent-mid text-white px-6 py-3 font-display flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" />
          New Protocol
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Categories */}
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted" />
            <input 
              type="text" 
              placeholder="Search Vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border p-3 pl-10 text-[10px] uppercase tracking-widest focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-1">
            <h3 className="mono-tag text-[10px] mb-4 px-2">Categories</h3>
            {categories.map(cat => (
              <button key={cat} className="w-full flex items-center gap-3 px-4 py-3 text-muted hover:text-white hover:bg-white/5 rounded-sm transition-all group">
                <Folder className="w-4 h-4 group-hover:text-accent" />
                <span className="text-xs font-medium uppercase tracking-wider">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main: Protocol List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-display">Recent Protocols</h2>
            <span className="mono-tag text-[10px] opacity-50">{protocols.length} Documents</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {protocols.map((doc) => (
              <motion.div
                key={doc.id}
                whileHover={{ x: 4 }}
                className="platinum-edge bg-card p-6 rounded-sm flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-sm group-hover:bg-accent/10 transition-colors">
                    <FileText className="w-6 h-6 text-muted group-hover:text-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium uppercase tracking-wider mb-1 group-hover:text-accent transition-colors">{doc.title}</h4>
                    <div className="flex items-center gap-4">
                      <span className="mono-tag text-[8px] bg-white/5 px-2 py-0.5 rounded-sm">{doc.category}</span>
                      <span className="mono-tag text-[8px] text-muted">Updated {doc.updatedAt}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
              </motion.div>
            ))}
          </div>

          {/* Prompt Library Section */}
          <div className="mt-12 space-y-4">
            <h2 className="text-xl font-display">AI Prompt Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border p-6 rounded-sm border-t-2 border-blue-500">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="mono-tag text-[10px]">Content Generation</span>
                </div>
                <h4 className="text-xs font-medium uppercase tracking-wider mb-2">Viral Hook Architect</h4>
                <p className="text-[10px] text-muted leading-relaxed mb-4">Optimized for short-form video hooks based on psychological triggers.</p>
                <button className="text-blue-500 mono-tag text-[8px] hover:underline">Copy Prompt Protocol</button>
              </div>
              <div className="bg-card border border-border p-6 rounded-sm border-t-2 border-accent">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="mono-tag text-[10px]">Strategic Analysis</span>
                </div>
                <h4 className="text-xs font-medium uppercase tracking-wider mb-2">Shadow Avatar Deep-Dive</h4>
                <p className="text-[10px] text-muted leading-relaxed mb-4">Extracts deep psychological pain points from raw customer data.</p>
                <button className="text-accent mono-tag text-[8px] hover:underline">Copy Prompt Protocol</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

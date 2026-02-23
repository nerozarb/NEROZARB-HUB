'use client';

import React, { useState } from 'react';
import { useData } from '@/context/data-context';
import { useAuth } from '@/context/auth-context';
import { cn, formatDate } from '@/lib/utils';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube,
  CheckCircle2,
  Clock,
  Filter,
  LayoutGrid,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ContentCalendarOS() {
  const { clients } = useData();
  const { role } = useAuth();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Mock content data for visualization
  const posts = React.useMemo(() => [
    {
      id: '1',
      clientId: '1',
      platform: 'Instagram',
      postType: 'Reel',
      hook: 'How we scaled to $10k/mo',
      scheduledDate: new Date().toISOString(),
      status: 'Scheduled',
      pillar: 'Scaling',
    },
    {
      id: '2',
      clientId: '1',
      platform: 'LinkedIn',
      postType: 'Authority Post',
      hook: 'The future of AI in 2026',
      scheduledDate: new Date(new Date().getTime() + 86400000).toISOString(),
      status: 'Draft',
      pillar: 'Efficiency',
    }
  ], []);

  const platformIcons: any = {
    Instagram: Instagram,
    LinkedIn: Linkedin,
    Twitter: Twitter,
    YouTube: Youtube,
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display tracking-tighter">Content Calendar</h1>
          <p className="mono-tag mt-1">Multi-Platform Distribution Engine</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-card border border-border flex p-1 rounded-sm">
            <button 
              onClick={() => setView('grid')}
              className={cn("p-2 rounded-sm transition-all", view === 'grid' ? "bg-accent text-white" : "text-muted hover:text-white")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-2 rounded-sm transition-all", view === 'list' ? "bg-accent text-white" : "text-muted hover:text-white")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="bg-accent hover:bg-accent-mid text-white px-6 py-3 font-display flex items-center gap-2 transition-all">
            <Plus className="w-4 h-4" />
            Plan Post
          </button>
        </div>
      </header>

      {/* Calendar Grid / List View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map((post) => {
          const Icon = platformIcons[post.platform] || CalendarIcon;
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="platinum-edge bg-card p-6 rounded-sm space-y-4 hover:border-accent transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-accent" />
                  <span className="mono-tag text-[10px]">{post.platform}</span>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[8px] font-mono uppercase tracking-widest",
                  post.status === 'Scheduled' ? "bg-accent/20 text-accent" : "bg-blue-500/20 text-blue-500"
                )}>
                  {post.status}
                </span>
              </div>
              
              <div>
                <p className="mono-tag text-[8px] text-muted mb-1">{post.postType}</p>
                <h4 className="text-sm font-medium uppercase tracking-wider line-clamp-2">{post.hook}</h4>
              </div>

              <div className="pt-4 border-t border-border flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-3 h-3 text-muted" />
                  <span className="mono-tag text-[8px]">{formatDate(post.scheduledDate)}</span>
                </div>
                <span className="mono-tag text-[8px] bg-white/5 px-2 py-0.5 rounded-sm">{post.pillar}</span>
              </div>
            </motion.div>
          );
        })}
        
        {/* Empty Slot Placeholder */}
        <div className="border border-dashed border-border rounded-sm flex flex-col items-center justify-center p-12 text-center group hover:border-accent transition-all cursor-pointer">
          <Plus className="w-8 h-8 text-muted group-hover:text-accent mb-4 transition-colors" />
          <p className="mono-tag text-[10px]">Add Post to Pipeline</p>
        </div>
      </div>
    </div>
  );
}

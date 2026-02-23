'use client';

import React, { useState } from 'react';
import { useData, Post } from '@/context/data-context';
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
  List,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ContentCalendarOS() {
  const { clients, posts, addPost } = useData();
  const { role } = useAuth();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isAddingPost, setIsAddingPost] = useState(false);

  const handleAddPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPost: Partial<Post> = {
      clientId: formData.get('clientId') as string,
      platform: formData.get('platform') as Post['platform'],
      postType: formData.get('postType') as string,
      hook: formData.get('hook') as string,
      scheduledDate: formData.get('scheduledDate') as string,
      status: formData.get('status') as Post['status'],
      pillar: formData.get('pillar') as string,
      content: formData.get('content') as string,
      assets: []
    } as any;
    addPost(newPost as any);
    setIsAddingPost(false);
  };

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
          <button
            onClick={() => setIsAddingPost(true)}
            className="bg-accent hover:bg-accent-mid text-white px-6 py-3 font-display flex items-center gap-2 transition-all"
          >
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
        <div
          onClick={() => setIsAddingPost(true)}
          className="border border-dashed border-border rounded-sm flex flex-col items-center justify-center p-12 text-center group hover:border-accent transition-all cursor-pointer"
        >
          <Plus className="w-8 h-8 text-muted group-hover:text-accent mb-4 transition-colors" />
          <p className="mono-tag text-[10px]">Add Post to Pipeline</p>
        </div>
      </div>

      {/* Add Post Modal */}
      <AnimatePresence>
        {isAddingPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingPost(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-card border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="platinum-edge p-8 overflow-y-auto">
                <div className="flex justify-between items-start mb-8">
                  <h2 className="text-3xl font-display tracking-tighter">Plan New Post</h2>
                  <button onClick={() => setIsAddingPost(false)} className="text-muted hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleAddPost} className="space-y-6">
                  <div>
                    <label className="mono-tag block mb-2">Select Client</label>
                    <select name="clientId" required className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent">
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="mono-tag block mb-2">Platform</label>
                      <select name="platform" className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent">
                        <option>Instagram</option>
                        <option>LinkedIn</option>
                        <option>Twitter</option>
                        <option>YouTube</option>
                      </select>
                    </div>
                    <div>
                      <label className="mono-tag block mb-2">Post Type</label>
                      <input name="postType" placeholder="e.g. Reel, Carousel, Authority Post" required className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                    </div>
                  </div>
                  <div>
                    <label className="mono-tag block mb-2">Hook / Title</label>
                    <input name="hook" required className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1">
                      <label className="mono-tag block mb-2">Status</label>
                      <select name="status" className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent">
                        <option>Draft</option>
                        <option>Review</option>
                        <option>Scheduled</option>
                        <option>Published</option>
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label className="mono-tag block mb-2">Content Pillar</label>
                      <input name="pillar" className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                    </div>
                    <div className="col-span-1">
                      <label className="mono-tag block mb-2">Date</label>
                      <input name="scheduledDate" type="date" required className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                    </div>
                  </div>
                  <div>
                    <label className="mono-tag block mb-2">Raw Content / Caption</label>
                    <textarea name="content" rows={4} className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                  </div>
                  <div className="flex gap-4 pt-4 border-t border-border">
                    <button type="submit" className="flex-1 bg-accent text-white py-4 font-display hover:bg-accent-mid transition-all">Schedule Post</button>
                    <button type="button" onClick={() => setIsAddingPost(false)} className="px-8 border border-border text-muted hover:text-white transition-all">Cancel</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

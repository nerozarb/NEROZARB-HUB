'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { motion } from 'motion/react';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AuthScreen() {
  const { login } = useAuth();
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(passphrase);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-display mb-2 tracking-tighter">
            NEROZARB<span className="text-accent">.</span>
          </h1>
          <p className="mono-tag">Agency Operating System v2.0</p>
        </div>

        <div className="platinum-edge bg-card p-8 rounded-sm">
          <div className="flex items-center gap-3 mb-8">
            <Lock className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-display">Access Protocol</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mono-tag block mb-2">Enter Passphrase</label>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className={cn(
                  "w-full bg-[#050505] border border-border p-4 text-white focus:outline-none focus:border-accent transition-colors",
                  error && "border-red-500"
                )}
                placeholder="••••••••••••"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-[10px] uppercase font-mono mt-2 tracking-widest">Invalid Passphrase</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent-mid text-white font-display py-4 flex items-center justify-center gap-2 transition-all group"
            >
              Initialize System
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-muted" />
              <span className="mono-tag text-[8px]">Encrypted Session</span>
            </div>
            <span className="mono-tag text-[8px]">Platinum Edge v1.0</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import { cn } from '@/lib/utils';

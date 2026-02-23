'use client';

import React, { useState } from 'react';
import { useData, Client } from '@/context/data-context';
import { useAuth } from '@/context/auth-context';
import { formatCurrency, cn, formatDate } from '@/lib/utils';
import {
  Search,
  Plus,
  MoreHorizontal,
  ExternalLink,
  User,
  Mail,
  Phone,
  Filter,
  ArrowUpDown,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ClientOS({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { clients, addClient, updateClient, deleteClient } = useData();
  const { role } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddingClient, setIsAddingClient] = useState(false);

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newClient: any = {
      name: formData.get('name') as string,
      status: 'Onboarding',
      revenueGate: Number(formData.get('revenueGate')),
      tier: formData.get('tier') as string,
      ltv: Number(formData.get('ltv')),
      contractValue: Number(formData.get('contractValue')),
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      contactName: formData.get('contactName') as string,
      niche: formData.get('niche') as string,
      shadowAvatar: formData.get('shadowAvatar') as string,
      bleedingNeck: formData.get('bleedingNeck') as string,
      contentPillars: (formData.get('contentPillars') as string).split(',').map(s => s.trim()).filter(Boolean),
      relationshipHealth: 'Neutral',
      onboardingStatus: 0,
      notes: '',
      startDate: new Date().toISOString().split('T')[0],
    };
    addClient(newClient);
    setIsAddingClient(false);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display tracking-tighter">Client OS</h1>
          <p className="mono-tag mt-1">Relationship Management & Revenue Gates</p>
        </div>
        <button
          onClick={() => setIsAddingClient(true)}
          className="bg-accent hover:bg-accent-mid text-white px-6 py-3 font-display flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Onboard Client
        </button>
      </header>

      {/* Search & Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search Clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border p-4 pl-12 text-xs uppercase tracking-widest focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <button className="bg-card border border-border px-6 flex items-center gap-2 text-muted hover:text-white transition-colors">
          <Filter className="w-4 h-4" />
          <span className="mono-tag">Filter</span>
        </button>
      </div>

      {/* Client Table */}
      <div className="platinum-edge bg-card rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-white/5">
              <th className="p-4 mono-tag text-[10px]">Client Name</th>
              <th className="p-4 mono-tag text-[10px]">Status</th>
              <th className="p-4 mono-tag text-[10px]">Niche</th>
              {role === 'CEO' && (
                <>
                  <th className="p-4 mono-tag text-[10px]">Revenue Gate</th>
                  <th className="p-4 mono-tag text-[10px]">LTV</th>
                </>
              )}
              <th className="p-4 mono-tag text-[10px]">Health</th>
              <th className="p-4 mono-tag text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-border hover:bg-white/5 transition-colors cursor-pointer group"
                onClick={() => setSelectedClient(client)}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent/20 flex items-center justify-center rounded-sm">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider">{client.name}</p>
                      <p className="mono-tag text-[8px]">{client.contactName}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[8px] font-mono uppercase tracking-widest",
                    client.status === 'Active' ? "bg-accent/20 text-accent" :
                      client.status === 'Onboarding' ? "bg-blue-500/20 text-blue-500" :
                        "bg-muted/20 text-muted"
                  )}>
                    {client.status}
                  </span>
                </td>
                <td className="p-4">
                  <p className="mono-tag text-[10px]">{client.niche}</p>
                </td>
                {role === 'CEO' && (
                  <>
                    <td className="p-4">
                      <p className="mono-tag text-[10px] text-accent-light">{formatCurrency(client.revenueGate)}</p>
                    </td>
                    <td className="p-4">
                      <p className="mono-tag text-[10px]">{formatCurrency(client.ltv)}</p>
                    </td>
                  </>
                )}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      client.relationshipHealth === 'Good' ? "bg-accent" :
                        client.relationshipHealth === 'At Risk' ? "bg-red-500" :
                          "bg-yellow-500"
                    )} />
                    <span className="mono-tag text-[10px]">{client.relationshipHealth}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button className="p-2 text-muted hover:text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Client Detail Modal */}
      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClient(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-card border border-border shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="platinum-edge p-8">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-display tracking-tighter">{selectedClient.name}</h2>
                      <span className="mono-tag bg-accent/10 text-accent px-2 py-1 rounded-sm">{selectedClient.tier}</span>
                    </div>
                    <p className="mono-tag">Client ID: {selectedClient.id} • Started {formatDate(selectedClient.startDate)}</p>
                  </div>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="p-2 text-muted hover:text-white transition-colors"
                  >
                    <Plus className="w-6 h-6 rotate-45" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {/* Left Column: Brand Info */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="mono-tag text-accent mb-4">Brand Identity</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="mono-tag text-[8px] block mb-1">Shadow Avatar</label>
                          <p className="text-xs uppercase tracking-wider">{selectedClient.shadowAvatar || 'Not Defined'}</p>
                        </div>
                        <div>
                          <label className="mono-tag text-[8px] block mb-1">Bleeding Neck</label>
                          <p className="text-xs uppercase tracking-wider text-red-400">{selectedClient.bleedingNeck || 'Not Defined'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mono-tag text-accent mb-4">Content Pillars</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedClient.contentPillars.length > 0 ? selectedClient.contentPillars.map(p => (
                          <span key={p} className="bg-white/5 border border-border px-2 py-1 mono-tag text-[8px]">{p}</span>
                        )) : (
                          <p className="mono-tag text-[8px]">No pillars defined</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Contact & Ops */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="mono-tag text-accent mb-4">Operations</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-muted" />
                          <div>
                            <p className="mono-tag text-[8px]">Primary Contact</p>
                            <p className="text-xs uppercase tracking-wider">{selectedClient.contactName}</p>
                          </div>
                        </div>
                        {role === 'CEO' && (
                          <>
                            <div className="flex items-center gap-3">
                              <Mail className="w-4 h-4 text-muted" />
                              <div>
                                <p className="mono-tag text-[8px]">Email Address</p>
                                <p className="text-xs tracking-wider">{selectedClient.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="w-4 h-4 text-muted" />
                              <div>
                                <p className="mono-tag text-[8px]">Phone Number</p>
                                <p className="text-xs tracking-wider">{selectedClient.phone}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Financials (CEO Only) */}
                  {role === 'CEO' ? (
                    <div className="space-y-8">
                      <div>
                        <h3 className="mono-tag text-accent mb-4">Financial Health</h3>
                        <div className="space-y-6">
                          <div className="bg-white/5 p-4 border border-border">
                            <p className="mono-tag text-[8px] mb-1">Monthly Revenue Gate</p>
                            <p className="text-2xl font-display text-accent-light">{formatCurrency(selectedClient.revenueGate)}</p>
                          </div>
                          <div className="bg-white/5 p-4 border border-border">
                            <p className="mono-tag text-[8px] mb-1">Lifetime Value (LTV)</p>
                            <p className="text-2xl font-display">{formatCurrency(selectedClient.ltv)}</p>
                          </div>
                          <div className="bg-white/5 p-4 border border-border">
                            <p className="mono-tag text-[8px] mb-1">Contract Value</p>
                            <p className="text-2xl font-display">{formatCurrency(selectedClient.contractValue)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 p-8 border border-dashed border-border flex flex-col items-center justify-center text-center">
                      <Lock className="w-8 h-8 text-muted mb-4" />
                      <p className="mono-tag text-[10px]">Financial Data Restricted</p>
                    </div>
                  )}
                </div>

                <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
                  <div className="flex gap-4">
                    <button className="bg-accent text-white px-6 py-2 mono-tag hover:bg-accent-mid transition-colors">Edit Profile</button>
                    <button
                      onClick={() => {
                        setActiveTab('fulfillment');
                        setSelectedClient(null);
                      }}
                      className="border border-border text-white px-6 py-2 mono-tag hover:bg-white/5 transition-colors"
                    >
                      View Tasks
                    </button>
                  </div>
                  {role === 'CEO' && (
                    <button
                      onClick={() => {
                        deleteClient(selectedClient.id);
                        setSelectedClient(null);
                      }}
                      className="text-red-500 mono-tag hover:underline"
                    >
                      Terminate Contract
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Client Modal */}
      <AnimatePresence>
        {isAddingClient && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingClient(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border shadow-2xl"
            >
              <div className="platinum-edge p-8">
                <h2 className="text-3xl font-display mb-8 tracking-tighter">New Client Onboarding</h2>
                <form onSubmit={handleAddClient} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="mono-tag block mb-2">Agency Name</label>
                      <input name="name" required className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                    </div>
                    <div>
                      <label className="mono-tag block mb-2">Contact Name</label>
                      <input name="contactName" required className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="mono-tag block mb-2">Email</label>
                      <input name="email" type="email" required className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                    </div>
                    <div>
                      <label className="mono-tag block mb-2">Phone</label>
                      <input name="phone" required className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="mono-tag block mb-2">Niche</label>
                      <input name="niche" required className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                    </div>
                    <div>
                      <label className="mono-tag block mb-2">Tier</label>
                      <select name="tier" className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent">
                        <option>Silver</option>
                        <option>Gold</option>
                        <option>Platinum</option>
                      </select>
                    </div>
                    <div>
                      <label className="mono-tag block mb-2">Revenue Gate</label>
                      <input name="revenueGate" type="number" required className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="mono-tag block mb-2">Contract Value</label>
                      <input name="contractValue" type="number" required className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                    </div>
                    <div>
                      <label className="mono-tag block mb-2">Initial LTV</label>
                      <input name="ltv" type="number" required className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="mono-tag block mb-2">Shadow Avatar</label>
                      <input name="shadowAvatar" required placeholder="e.g. Scaling CEO" className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                    </div>
                    <div>
                      <label className="mono-tag block mb-2">Bleeding Neck Problem</label>
                      <input name="bleedingNeck" required placeholder="e.g. Operations bottleneck" className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                    </div>
                  </div>
                  <div>
                    <label className="mono-tag block mb-2">Content Pillars (Comma Separated)</label>
                    <input name="contentPillars" required placeholder="e.g. Growth, Operations, Mindset" className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-accent text-white py-4 font-display hover:bg-accent-mid transition-all">Initialize Onboarding</button>
                    <button type="button" onClick={() => setIsAddingClient(false)} className="px-8 border border-border text-muted hover:text-white transition-all">Cancel</button>
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

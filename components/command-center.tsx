'use client';

import React from 'react';
import { useData } from '@/context/data-context';
import { useAuth } from '@/context/auth-context';
import { formatCurrency, cn } from '@/lib/utils';
import {
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

export default function CommandCenter({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { clients, tasks } = useData();
  const { role } = useAuth();

  const activeClients = clients.filter(c => c.status === 'Active').length;
  const pendingTasks = tasks.filter(t => t.status !== 'Done').length;
  const criticalTasks = tasks.filter(t => t.priority === 'Critical' && t.status !== 'Done').length;

  const totalLtv = clients.reduce((acc, curr) => acc + curr.ltv, 0);
  const mrr = clients.reduce((acc, curr) => acc + curr.contractValue, 0);

  const stats = [
    {
      label: 'Active Clients',
      value: activeClients,
      icon: Users,
      color: 'text-accent',
      ceoOnly: false
    },
    {
      label: 'Pending Tasks',
      value: pendingTasks,
      icon: Clock,
      color: 'text-blue-400',
      ceoOnly: false
    },
    {
      label: 'Critical Alerts',
      value: criticalTasks,
      icon: AlertCircle,
      color: 'text-red-500',
      ceoOnly: false
    },
    {
      label: 'Monthly Revenue',
      value: formatCurrency(mrr),
      icon: TrendingUp,
      color: 'text-accent-light',
      ceoOnly: true
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display tracking-tighter">Command Center</h1>
          <p className="mono-tag mt-1">Global Operations Overview</p>
        </div>
        <div className="text-right">
          <p className="mono-tag text-[10px]">System Status</p>
          <div className="flex items-center gap-2 justify-end">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-widest text-accent">Operational</span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          if (stat.ceoOnly && role !== 'CEO') return null;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="platinum-edge bg-card p-6 rounded-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
                <span className="mono-tag text-[8px]">Live Data</span>
              </div>
              <p className="text-3xl font-display tracking-tighter mb-1">{stat.value}</p>
              <p className="mono-tag text-[10px]">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity / Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-display">Active Sprints</h2>
            <button
              onClick={() => setActiveTab('fulfillment')}
              className="mono-tag text-accent hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="platinum-edge bg-card rounded-sm overflow-hidden">
            {tasks.length === 0 ? (
              <div className="p-12 text-center">
                <p className="mono-tag text-muted">No active tasks found in the system.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-white/5">
                    <th className="p-4 mono-tag text-[10px]">Task</th>
                    <th className="p-4 mono-tag text-[10px]">Client</th>
                    <th className="p-4 mono-tag text-[10px]">Priority</th>
                    <th className="p-4 mono-tag text-[10px]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.slice(0, 5).map((task) => (
                    <tr key={task.id} className="border-b border-border hover:bg-white/5 transition-colors cursor-pointer">
                      <td className="p-4">
                        <p className="text-xs font-medium uppercase tracking-wider">{task.name}</p>
                      </td>
                      <td className="p-4">
                        <p className="mono-tag text-[10px]">{clients.find(c => c.id === task.clientId)?.name}</p>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-mono uppercase tracking-widest",
                          task.priority === 'Critical' ? "bg-red-500/20 text-red-500" :
                            task.priority === 'High' ? "bg-orange-500/20 text-orange-500" :
                              "bg-blue-500/20 text-blue-500"
                        )}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            task.status === 'Done' ? "bg-accent" : "bg-blue-400"
                          )} />
                          <span className="mono-tag text-[10px]">{task.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Client Health */}
        <div className="space-y-4">
          <h2 className="text-xl font-display">Client Health</h2>
          <div className="platinum-edge bg-card p-6 rounded-sm space-y-6">
            {clients.slice(0, 5).map((client) => (
              <div key={client.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-medium uppercase tracking-wider">{client.name}</p>
                  <span className={cn(
                    "text-[8px] font-mono uppercase tracking-widest",
                    client.relationshipHealth === 'Good' ? "text-accent" :
                      client.relationshipHealth === 'At Risk' ? "text-red-500" :
                        "text-yellow-500"
                  )}>
                    {client.relationshipHealth}
                  </span>
                </div>
                <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      client.relationshipHealth === 'Good' ? "bg-accent" :
                        client.relationshipHealth === 'At Risk' ? "bg-red-500" :
                          "bg-yellow-500"
                    )}
                    style={{ width: `${client.onboardingStatus}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="mono-tag text-[8px]">Onboarding</span>
                  <span className="mono-tag text-[8px]">{client.onboardingStatus}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
